import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { Neo4jModule } from 'nest-neo4j';
import { CsvController } from './csv.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [Neo4jModule.forRoot({
        scheme: 'neo4j',
        host: 'localhost',
        port: 7687,
        username: 'neo4j',
        password: '12345678'
      }),
      MulterModule.register({
        dest: '../uploads',
      }),
    ],
    controllers: [CsvController],
    providers: [CsvService],
  })
  export class CsvModule {}