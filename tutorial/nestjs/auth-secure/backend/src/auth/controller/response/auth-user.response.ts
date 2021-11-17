import { User } from '.prisma/client';

export type AuthUserType = Partial<Omit<User, 'password'>>;
