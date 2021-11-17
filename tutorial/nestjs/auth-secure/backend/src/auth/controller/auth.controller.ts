import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDTO } from './request/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  register(@Body() user: RegisterUserDTO) {
    return 'hi';
  }
}
