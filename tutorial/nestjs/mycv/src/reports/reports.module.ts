import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { Reports } from './reports.entity';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [TypeOrmModule.forFeature([Reports])],
})
export class ReportsModule {}
