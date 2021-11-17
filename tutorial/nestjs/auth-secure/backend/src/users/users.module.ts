import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateUserService } from './service/create-user.service';
import { FindByEmailService } from './service/find-by-email.service';
import { RemoveRefreshTokenService } from './service/remove-refresh-token.service';
import { UpdateRefreshTokenService } from './service/update-refresh-token.service';

@Module({
  providers: [
    FindByEmailService,
    CreateUserService,
    UpdateRefreshTokenService,
    RemoveRefreshTokenService,
  ],
  imports: [PrismaModule],
  exports: [
    FindByEmailService,
    CreateUserService,
    UpdateRefreshTokenService,
    RemoveRefreshTokenService,
  ],
})
export class UsersModule {}
