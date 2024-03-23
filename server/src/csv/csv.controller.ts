import { Controller, Post, Get, UseInterceptors, UploadedFile, Query, ParseIntPipe } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { CsvService } from './csv.service';

@Controller('clientes')
export class CsvController {
  constructor(private readonly neo4jService: Neo4jService, private readonly csvService: CsvService) {}

  @Post('createNodesFromCsv')
  @UseInterceptors(FileInterceptor('data.csv'))
  async createNodeWithArray(@UploadedFile() file: Multer.File): Promise<any> {
    console.log('Arquivo recebido:', file);

    const arrayCsv = await this.csvService.processarArquivoCSV(file);

    for (const obj of arrayCsv) {
        const objJson = JSON.stringify(obj);
        const propertiesMap = JSON.parse(objJson);
        const query = `
          CREATE (n:Cliente $properties)
          RETURN n
        `;
  
        const result = await this.neo4jService.write(query, { properties: propertiesMap });
        console.log('Nó criado:', result);
      }
  
      return { success: true };
  }

  @Get()
  async getClientes(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filtros') filtros?: string,
    @Query('valores') valores?: any,
  ): Promise<any> {
    var neo4j = require('neo4j-driver');
    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    let filtroCypher = '';
    const params = { startIndex: neo4j.int(startIndex), limit: neo4j.int(limit) };

    if (filtros && valores) {
      const filtrosArray = filtros.split(',');
      const valoresArray = valores.split(',');

      if (filtrosArray.length === valoresArray.length) {
        for (let index = 0; index < filtrosArray.length; index++) {
          const filtro = filtrosArray[index];
          let valor = valoresArray[index];

          if (filtro === 'isDocumentValid' || filtro === 'isPaymentValid') {
            valor = valor === 'Sim' ? true : false;
          }

          if (filtro === 'dtContrato' || filtro === 'dtVctPre') {
            let date = new Date(valor);
            date.setUTCHours(3, 0, 0, 0);
            valor = date.toISOString();
          }

          if (index === 0) {
            filtroCypher += `WHERE c.${filtro} = $valor${index} `;
          } else {
            filtroCypher += `AND c.${filtro} = $valor${index} `;
          }
          params[`valor${index}`] = valor;
        }
      }
    }

    const query = `
          MATCH (c:Cliente)
          ${filtroCypher}
          RETURN c
          SKIP $startIndex
          LIMIT $limit
      `;

    const result = await this.neo4jService.read(query, params);

    return result.records.map(record => record.toObject());
  }
}