import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthenticationGuard } from './guards/local.guard';
import { AuthUserType } from './interfaces/request-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDTO) {
    return this.authService.register(registerUser);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@AuthUser() user: AuthUserType, @Res() res: Response) {
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    res.setHeader('Set-Cookie', cookie);
    return res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@AuthUser() user: AuthUserType, @Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  auth(@AuthUser() user: AuthUserType) {
    return user;
  }
}
