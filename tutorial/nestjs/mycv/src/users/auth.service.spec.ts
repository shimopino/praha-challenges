import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    // DIコンテナから対象のサービスクラスのインスタンスを取得する
    service = module.get(AuthService);
  });

  it('can create an instanve of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');

    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (err) {
      expect(err).toHaveProperty('message', 'email in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('asdf@asdf.com', 'asdf');
    } catch (err) {
      expect(err).toHaveProperty('message', 'user not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdfg');

    try {
      await service.signin('asdf@asdf.com', 'asdf');
    } catch (err) {
      expect(err).toHaveProperty('message', 'bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf');

    const user = await service.signin('asdf@asdf.com', 'asdf');

    expect(user).toBeDefined();
  });
});
