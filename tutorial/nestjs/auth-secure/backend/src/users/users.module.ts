import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';

@Module({
  providers: [UsersService],
})
export class UsersModule {}
