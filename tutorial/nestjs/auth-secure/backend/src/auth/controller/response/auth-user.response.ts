import { Exclude } from 'class-transformer';

export class AuthUserType {
  id: string;
  name: string;
  email: string;

  @Exclude()
  refreshToken?: string;
}
