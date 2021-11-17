import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateUserService } from './service/create-user.service';
import { FindByEmailService } from './service/find-by-email.service';

@Module({
  providers: [FindByEmailService, CreateUserService],
  imports: [PrismaModule],
})
export class UsersModule {}
