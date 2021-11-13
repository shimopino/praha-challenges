import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { RegisterUserDTO } from './dtos/register-user.dto';
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
}
