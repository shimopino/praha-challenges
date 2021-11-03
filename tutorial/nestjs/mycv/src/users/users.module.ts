import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInteceptor } from './interceptors/current-user.interceptor';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserInteceptor],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
