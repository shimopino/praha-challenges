import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TokenInterceptor } from '../interceptor/token.interceptor';
import { RegisterUserService } from '../service/register-user.service';
import { RegisterUserDTO } from './request/register-user.dto';
import { RegisterUserResponse } from './response/register-user.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUser: RegisterUserService) {}

  @Post('register')
  @UseInterceptors(TokenInterceptor)
  async register(@Body() user: RegisterUserDTO) {
    const result = await this.registerUser.execute(user);
    const response = new RegisterUserResponse({ ...result });
    return response;
  }
}
