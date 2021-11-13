import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async register(registerUser: RegisterUserDTO) {
    const hashedPassword = await bcrypt.hash(registerUser.password, 10);

    try {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { password, ...createdUser } = await this.usersService.create({
        ...registerUser,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error: unknown) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Wrong credentials provided');
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    const { password, ...authenticatedUser } = user;
    return authenticatedUser;
  }
}
