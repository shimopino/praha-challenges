import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './reports/reports.entity';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Reports],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
