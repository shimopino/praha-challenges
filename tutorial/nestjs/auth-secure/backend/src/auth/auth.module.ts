import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { RegisterUserService } from './service/register-user.service';

@Module({
  controllers: [AuthController],
  providers: [RegisterUserService],
  imports: [UsersModule],
})
export class AuthModule {}
