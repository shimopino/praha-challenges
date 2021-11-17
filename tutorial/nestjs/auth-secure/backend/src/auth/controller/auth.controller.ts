import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
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
}
