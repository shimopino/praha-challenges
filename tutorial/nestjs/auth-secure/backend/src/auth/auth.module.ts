import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { RegisterUserService } from './service/register-user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SignAccessTokenService } from './service/sign-access-token.service';
import { LoginUserService } from './service/login.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { VerifyJwtPayloadService } from './service/verify-payload.service';
import { VerifyRefreshTokenService } from './service/verify-refresh-token.service';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { SignRefreshTokenService } from './service/sign-refresh-token.service';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserService,
    RegisterUserService,
    SignAccessTokenService,
    SignRefreshTokenService,
    VerifyJwtPayloadService,
    VerifyRefreshTokenService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({})],
})
export class AuthModule {}
