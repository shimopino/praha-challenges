import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { RemoveRefreshTokenService } from '../../users/service/remove-refresh-token.service';
import { AuthUser } from '../decorator/auth-user.decorator';
import { JWTAuthGuard } from '../guard/jwt-auth.guard';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { LocalAuthGuard } from '../guard/local.guard';
import { AccessTokenInterceptor } from '../interceptor/access-token.interceptor';
import { RefreshTokenInterceptor } from '../interceptor/refresh-token.interceptor';
import { RegisterUserService } from '../service/register-user.service';
import { RegisterUserDTO } from './request/register-user.dto';
import { AuthUserType } from './response/auth-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserService,
    private readonly removeRefreshToken: RemoveRefreshTokenService,
  ) {}

  @Post('register')
  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(RefreshTokenInterceptor)
  async register(@Body() user: RegisterUserDTO): Promise<AuthUserType> {
    const result = await this.registerUser.execute(user);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(RefreshTokenInterceptor)
  async login(@AuthUser() user: AuthUserType): Promise<AuthUserType> {
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  async logout(@AuthUser() user: AuthUserType, @Res() res: Response) {
    await this.removeRefreshToken.execute(user.email);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send();
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(AccessTokenInterceptor)
  refresh(@AuthUser() user: AuthUserType) {
    return user;
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  me() {
    return 'hi';
  }
}
