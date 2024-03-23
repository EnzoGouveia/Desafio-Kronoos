import { Module } from '@nestjs/common';
import { CsvModule } from './csv/csv.module'

@Module({
  imports: [CsvModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
