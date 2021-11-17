import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserService } from '../../users/service/create-user.service';
import { RegisterUserDTO } from '../controller/request/register-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaErrorCode } from '../../prisma/prisma-error-code';

@Injectable()
export class RegisterUserService {
  constructor(private readonly createUser: CreateUserService) {}

  public async execute(user: RegisterUserDTO) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    try {
      const createdUser = await this.createUser.execute({
        ...user,
        password: hashedPassword,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, refreshToken, ...result } = createdUser;
      return result;
    } catch (e) {
      if (e?.code === PrismaErrorCode.SQLITE_UNIQUE_CONSTRAINTS) {
        throw new BadRequestException('メールアドレスは既に使われています。');
      }
      throw new InternalServerErrorException();
    }
  }
}
