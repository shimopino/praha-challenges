import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FindByEmailService } from '../../users/service/find-by-email.service';
import * as bcrypt from 'bcrypt';
import { AuthUserType } from '../controller/response/auth-user.response';

@Injectable()
export class LoginUserService {
  constructor(private readonly findByEmail: FindByEmailService) {}

  async execute(email: string, password: string): Promise<AuthUserType> {
    const user = await this.findByEmail.execute(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('パスワードが一致しません。');
    }

    delete user.password;
    delete user.refreshToken;
    return user;
  }
}
