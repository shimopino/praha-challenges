import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './reports/reports.entity';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
// eslint-disable-next-line
const cookieSession = require('cookie-session');

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
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasdf'],
        }),
      )
      .forRoutes('*');
  }
}
