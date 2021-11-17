import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUser } from '../decorator/auth-user.decorator';
import { JWTAuthGuard } from '../guard/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/local.guard';
import { TokenInterceptor } from '../interceptor/token.interceptor';
import { RegisterUserService } from '../service/register-user.service';
import { RegisterUserDTO } from './request/register-user.dto';
import { AuthUserType } from './response/auth-user.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUser: RegisterUserService) {}

  @Post('register')
  @UseInterceptors(TokenInterceptor)
  async register(@Body() user: RegisterUserDTO): Promise<AuthUserType> {
    const result = await this.registerUser.execute(user);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: AuthUserType): Promise<AuthUserType> {
    return user;
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  me() {
    return 'hi';
  }
}
