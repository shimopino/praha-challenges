import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserService } from '../service/register-user.service';
import { RegisterUserDTO } from './request/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUser: RegisterUserService) {}

  @Post('register')
  async register(@Body() user: RegisterUserDTO) {
    const result = await this.registerUser.execute(user);
    return result;
  }
}
