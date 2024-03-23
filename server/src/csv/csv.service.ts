import { Injectable } from '@nestjs/common';
import { Csv } from './csv.interface';
import { CsvValidation } from './csv.validation';
import { Multer } from 'multer';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class CsvService {

    async processarArquivoCSV(file: Multer.File): Promise<Csv[]> {
        return new Promise((resolve, reject) => {
            const csvArray: Csv[] = [];
        
            fs.createReadStream(file.path)
                .pipe(csvParser())
                .on('data', (row: Csv) => {
                    let validateRow = CsvValidation(row);
                    const contrato = validateRow;
                    csvArray.push(contrato);
                })
                .on('end', () => {
                    console.log('Leitura do arquivo CSV concluída.');
                    console.log(csvArray[0]);
                    resolve(csvArray);
                })
                .on('error', (error) => {
                    console.error('Erro ao processar arquivo CSV:', error);
                    reject(error);
                });
        });
    }
}