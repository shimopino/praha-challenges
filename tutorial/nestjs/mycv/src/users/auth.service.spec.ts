import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      // logInsert 関数などは不要
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('throws an error ig user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

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
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);

    try {
      await service.signin('asdf@asdf.com', 'asdfasdf');
    } catch (err) {
      expect(err).toHaveProperty('message', 'bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'asdf@asdf.com',
          password:
            '8d1e1424cf498c38.f7960feb125bcd7bcbfa7445dfb81d8f25fcaf2e6875694ad2ef09b090b26f8a',
        } as User,
      ]);

    const user = await service.signin('asdf@asdf.com', 'asdf');

    expect(user).toBeDefined();

    // const user = await service.signup('asdf@asdf.com', 'asdf');
    // console.log(user);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf');

    const user = await service.signin('asdf@asdf.com', 'asdf');

    expect(user).toBeDefined();

    // const user = await service.signup('asdf@asdf.com', 'asdf');
    // console.log(user);
  });
});
