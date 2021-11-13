import { User } from '.prisma/client';

export type AuthUserType = Omit<User, 'password'>;
