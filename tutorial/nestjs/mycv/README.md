# Authentication App

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Authentication App](#authentication-app)
  - [init](#init)
  - [ORM](#orm)
  - [Entity](#entity)
  - [Validation](#validation)
  - [Create / Save](#create--save)
  - [Update](#update)
  - [Exclude](#exclude)
  - [Interceptors](#interceptors)
  - [DTO](#dto)
  - [Authentication](#authentication)
    - [Sign Up](#sign-up)
    - [Sign In](#sign-in)
    - [Session](#session)
    - [Signup / Signin](#signup--signin)
    - [Sign out](#sign-out)
    - [Decorator](#decorator)
    - [Interceptor](#interceptor)
    - [Globally Scoped](#globally-scoped)
    - [Guard](#guard)
  - [Testing](#testing)
    - [Injection](#injection)
    - [SignUp](#signup)
    - [Mock](#mock)
    - [Controller](#controller)
  - [E2E Testing](#e2e-testing)
    - [App Module](#app-module)
  - [Application Configuration](#application-configuration)
    - [Dotenv](#dotenv)
    - [jest setup](#jest-setup)
    - [ConfigModule](#configmodule)
  - [Report](#report)
    - [Create Report](#create-report)
    - [Associations](#associations)
    - [Save Associations](#save-associations)
    - [Formatting Response](#formatting-response)
  - [Authorization](#authorization)
    - [default column](#default-column)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## init

まずは必要なモジュールを作成する。

```bash
nest g module users
nest g controller users
nest g service users

nest g module reports
nest g controller reports
nest g service reports
```

## ORM

アプリケーション側のオブジェクトを永続化するためのライブラリをインストールする。

```bash
npm install @nestjs/typeorm typeorm sqlite3
```

`sqlite` でデータを永続化したい場合は、トップレベルのモジュールに `typeorm` のモジュールを追加する。

```ts
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    // DBへの接続設定を以下のように追加する
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

- `synchronize`
  - 開発時に使用する設定であり、SQLite でのマイグレーションを同期させて実行する

## Entity

TypeORM でエンティティを作成するには、まずは以下のようにクラスを作成する。

```ts
// users/users.entity.ts
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
```

- `@PrimaryGeneratedColumn`
  - DB 側で主キーを自動採番する設定

あとはこのエンティティを使用するモジュール内で設定に追加する必要がある。

```ts
// users/users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
```

## Validation

セキュリティを考慮して、バリデーション設定に `whitelist: true` を追加することで設定されているプロパティのみを受け付けるようにする。

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
```

つまり以下のように HTTP ボディを送信することを考える。

```json
{
  "email": "example@example.com",
  "password": "example",
  "admin": true
}
```

この場合 `whitelist: true` を設定した上で、メールアドレスとパスワードのみを受け取るように設定しておけば、以下のように特定のプロパティのみを受け取ることができる。

```json
{
  "email": "example@example.com",
  "password": "example"
}
```

## Create / Save

TypeORM でエンティティを永続化するには、アプリケーション内にエンティティをインスタンスとして生成することと、実際に DB に永続化することが必要となる。

```ts
create(email: string, password: string) {
  // インスタンス化させる
  const user = this.repo.create({email, password})

  // 永続化
  return this.repo.save(user)
}
```

TypeORM では、特定のアノテーションを付与することで、インスタンスを永続化させる前後に処理を挟み込むことができる。

以下のように実装すると、`this.repo.save(user)` が実行された際に、`@AfterInsert()` のメソッドが呼び出される。

```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
```

## Update

エンティティを更新する場合、必ず全てのプロパティをユーザーが指定する必要はない。

このような場合、DTO のプロパティに対して `Optional` な項目であることを指定する必要がある。

```ts
export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
```

TypeORM 経由でエンティティの値を更新する場合は、まず最初にエンティティのインスタンスを取得してから更新する必要がある。

```ts
async update(id: number, attrs: Partial<User>) {
  const user = await this.findOne(id);

  if (!user) {
    throw new Error('user not found');
  }

  Object.assign(user, attrs);

  return this.repo.save(user);
}
```

## Exclude

現在では取得したエンティティのプロパティをすべてユーザーに返しているが、一部のプロパティはユーザーに返す必要はない。

こういった場合は以下のように `Exclude` を付与すればいい。

```ts
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;
}
```

あとは適用したいコントローラーのメソッドにアノテーションを付与すればいい。

```ts
@UseInterceptors(ClassSerializerInterceptor)
@Get('/:id')
async findUser(@Param('id') id: string) {
  const user = await this.usersService.findOne(parseInt(id));
  if (!user) {
    throw new NotFoundException('user not found');
  }

  return user;
}
```

## Interceptors

`Exclude` を使用すれば、ユーザーに返すプロパティを制御することが可能だが、ユーザーの特性に合わせて返すプロパティを選択するようなことはできない。

そこでより柔軟な方法である `Interceptor` を採用する。

```ts
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // HTTPリクエストを処理する前に実行する処理
    console.log('running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // HTTPリクエストを処理した後で実行する処理
        console.log('running before response is sent out.');
      }),
    );
  }
}
```

- `ExecutionContext`
  - HTTP リクエストに関する情報が含まれている
- `CallHandler`
  - 次に実行する処理の情報が含まれている

あとはコントローラーの処理に付与していたアノテーションを以下のように変更すればいい。

```ts
@UseInterceptors(SerializeInterceptor)
```

## DTO

柔軟に変更することが可能な DTO 形式を採用する。

```ts
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
```

あとは Interceptor を使用して、以下のように DTO に変換してえばえばいい。

```ts
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        // Userエンティティを特定のDTOに変換する
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
```

なお以下のようにカスタムアノテーションを作成して、コントローラーに付与できるようにしておくと便利である。

```ts
export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
```

これで以下のようにメソッドだけでなく、クラス全体にも適用できるアノテーションを付与することができた。

```ts
@Controller('auth')
@Serialize(UserDto)
export class UserController {
  // ...

  @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // ...
  }
}
```

今の処理では引数に文字列なども受け入れることができてしまうため、以下のようにクラスのみを指定できるように、型による制限を追加する。

```ts
interface ClassConstructor {
  new (...args: any[]): void;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
```

## Authentication

### Sign Up

まずは登録時に指定されたメールアドレスを他のユーザーも使用していないのか検証する。

```ts
async signup(email: string, password: string) {
  const users = await this.usersService.find(email);
  if (users.length) {
    throw new BadRequestException('email in use');
  }
}
```

ユーザーの登録時には、メールアドレスとパスワードを保存する必要があるが、パスワードは平文ではなくハッシュ化させた状態で保持するようにする。

そのため `scrypt` ライブラリを使用する。またユーザーのパスワードの文字列数が少ない場合にも対応するため `salt` と呼ばれるハッシュ関数に入力する文字列を自動生成させ、パスワードと組み合わせてハッシュ化させる。

```ts
const scrypt = promisify(_scrypt);

// ...

const salt = randomBytes(8).toString('hex');
const hash = (await scrypt(password, salt, 32)) as Buffer;

const result = salt + '.' + hash.toString('hex');
```

あとはこの内容で DB に登録すればいい。

```ts
const user = await this.usersService.create(email, result);
```

### Sign In

ユーザーのログイン時には、登録時と同じ手順でパスワードをハッシュ化させて、DB に登録されているパスワードと比較を行えばいい。

```ts
const [user] = await this.usersService.find(email);

const [salt, storedHash] = user.password.split('.');

const hash = (await scrypt(password, salt, 32)) as Buffer;

if (storedHash !== hash.toString('hex')) {
  throw new BadRequestException('bad password');
}

return user;
```

### Session

今回は Cookie ベースでセッション管理を実施する。

```bash
npm install cookie-session @types/cookie-session
```

ここで NestJS のアプリケーション設定に、ミドルウェアとして追加する。

```ts
app.use(
  cookieSession({
    keys: ['sldjhfas'],
  }),
);
```

こうしておけばコントローラーのハンドラ関数に以下のように引数にセッションを指定しておけば、Cookie に指定の値を登録しておくことが可能となる。

```ts
@Get('/colors/:color')
setColor(@Param('color') color: string, @Session() session: any) {
  session.color = color;
}

@Get('/colors')
getColor(@Session() session: any) {
  return session.color;
}
```

これで以下のように HTTP リクエストを発行すると、サーバーから Cookie が送信されていることがわかる。

```bash
# GET http://localhost:3000/auth/colors/red

HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: express:sess=eyJjb2xvciI6InJlZCJ9; path=/; httponly,express:sess.sig=WswN9RZRMvAvbPjr0HWvCnfYEi4; path=/; httponly
Date: Wed, 03 Nov 2021 09:31:09 GMT
Connection: close
Content-Length: 0
```

これで以下のようにセッションに格納されている内容を取得する処理を実行すると、前回のリクエスト時に登録した値がセッションに格納されていることがわかる。

```bash
# GET http://localhost:3000/auth/colors

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 3
ETag: W/"3-eJiAELiQzm9NITZIHzknh+xtYQY"
Date: Wed, 03 Nov 2021 09:31:37 GMT
Connection: close

red
```

### Signup / Signin

セッションを使用すると、以下のようにユーザーの登録やログイン時に、セッションに対してユーザーの ID を設定することが可能となる。

```ts
  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
```

これで以下のようにユーザーの登録を行えばユーザー ID がクッキーとして渡されていることがわかる。

```bash
# POST http://localhost:3000/auth/signup
# Content-Type: application/json

# {
#     "email": "test@test.com",
#     "password": "zxcv"
# }

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 32
ETag: W/"20-OieX8llTxVyn25/DqLzbCp9cTZU"
Set-Cookie: express:sess=eyJjb2xvciI6InJlZCIsInVzZXJJZCI6Mn0=; path=/; httponly,express:sess.sig=KsBHtPNjFI8CZXHpb7gFGOjfEXU; path=/; httponly
Date: Wed, 03 Nov 2021 09:54:15 GMT
Connection: close

{
  "id": 2,
  "email": "test@test.com"
}
```

後続の HTTP リクエストでユーザーのログインを実施すると、新たにクッキーが渡されていないことがわかる。これは、サーバー内でのセッション ID が書きかわっていないためである。

```bash
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 32
ETag: W/"20-OieX8llTxVyn25/DqLzbCp9cTZU"
Date: Wed, 03 Nov 2021 09:55:03 GMT
Connection: close

{
  "id": 2,
  "email": "test@test.com"
}
```

これで以下のように現在のセッションを使用しているユーザーの情報を取得するエンドポイントを設けることで、ユーザー情報を確認することができる。

```ts
@Get('/whoami')
WhoAmI(@Session() session: any) {
  return this.usersService.findOne(session.userId);
}
```

### Sign out

後は以下のようにログインしているユーザーをログアウトするためのエンドポイントを作成する。

```ts
@Post('/signout')
singOut(@Session() session: any) {
  session.userId = null;
}
```

これで現在のセッションに登録されているユーザー ID を初期化することができた。

しかし、ログアウトした状態から `/whoami` にアクセスすると、ユーザーテーブルに登録されている最初のユーザー情報が取得できてしまっていることがわかる。

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 32
ETag: W/"20-5oGrrW/Q7an1ZWKqR2T/LBlM9s8"
Date: Wed, 03 Nov 2021 10:10:39 GMT
Connection: close

{
  "id": 1,
  "email": "asdf@asdf.com"
}
```

そこで内部で使用している `findOne` 関数で、ユーザー ID が無効化されていた場合にユーザー情報を返さないように処理を変更する必要がある。

```ts
findOne(id: number) {
  if (!id) {
    return null;
  }

  return this.repo.findOne(id);
}
```

### Decorator

NestJS のデコレーター機能を使用すれば、ハンドラー関数の引数に HTTP リクエスト情報を渡す前に、任意の処理を挟み込ませて、ハンドラー関数の引数を変更することができる。

イメージとしては、以下のように引数にデコレーターを渡してセッション情報から現在ログインしているユーザーを取得する処理を、デコレーター側の処理で記述することができる。

```ts
@Get('/whoami')
WhoAmI(@CurrentUser() user: User) {
  return user;
}
```

上記のようなデコレーターは `createParamDecorator` を使用することで簡単に作成することができ、`ExecutionContext` から HTTP リクエストやその他のプロトコルに関する情報を抽出することができる。

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return 'hi there';
  },
);
```

ここで現在ログインしているユーザーの情報を取得するには、ユーザーの情報を取り扱うためのサービスクラスを利用する必要があるが、ユーザーモジュールの依存関係を使用する必要がある。

### Interceptor

ユーザーの情報を取得するためには、インターセプターを利用して HTTP リクエストの内容を受けてセッション情報を加工することができる。

ここでは、以下のように HTTP リクエストを受けた際にセッション情報からユーザー ID を取得し、ユーザー ID から取得できたユーザー情報を新たにセッションに登録し、登録されたユーザー情報をデコレーターから抽出するように変更する。

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInteceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
```

つまり以下のようにデコレーターを修正する。

```ts
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
```

後は以下のようにコントローラーの処理の前後に挟み込めばいい。

```ts
@UseInterceptors(CurrentUserInteceptor)
export class UsersController {
  // ...
}
```

### Globally Scoped

コントローラーに対して個別にインターセプターを設定する場合、コントローラー自体の数が増えていくにつれて設定する内容が冗長的になってしまう。

そこで以下のように `module` に対してどのコントローラーに対しても共通的にインターセプターを適用する設定を追加できる。

```ts
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // アプリケーションの設定として追加できる
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInteceptor,
    },
  ],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
```

### Guard

今の状態ではユーザーがログインしていない状態でも 200 系のステータスコードが返ってきている。

そこで NestJS が提供している `Guard` を使用して、以下のようにどのリクエストを許可・拒否するのかを表すために、`boolean` を返すクラスを作成する。

```ts
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // null や　undefined の場合は falsy となる
    // つまりアクセスは拒否される
    return request.session.userId;
  }
}
```

後はこの `Guard` を適用したいコントローラーやハンドラー関数に対して適用すればいい。

```bash
@Get('/whoami')
@UseGuards(AuthGuard)
WhoAmI(@CurrentUser() user: User) {
  return user;
}
```

こうすればログインしていない状態で対象のエンドポイントにリクエストを送信すると、以下のように `403` の非認証エラーが表示される。

```bash
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 69
ETag: W/"45-T7Txzr/IRLfQ4TEPfbVWLpgje4Q"
Date: Wed, 03 Nov 2021 11:54:24 GMT
Connection: close

{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Testing

### Injection

以下のようにテスト用のモジュール設定を登録する際に、テスト対象である `AuthService` を DI コンテナに登録する。

```ts
describe('', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
});
```

しかし認証系のサービスが依存しているユーザーモジュールは DI コンテナに登録されていないため、テストを実行すると対象のインスタンスを取得できないため、以下のようなエラーが発生してしまう。

```bash
 FAIL  src/users/auth.service.spec.ts
  ✕ can create an instanve of auth service (8 ms)

  ● can create an instanve of auth service

    Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument UsersService at index [0] is available in the RootTestModule context.

    Potential solutions:
    - If UsersService is a provider, is it part of the current RootTestModule?
    - If UsersService is exported from a separate @Module, is that module imported within RootTestModule?
      @Module({
        imports: [ /* the Module containing UsersService */ ]
      })
```

そこで依存している `UsersService` を使用できるように仮作成したものを DI コンテナに登録する必要がある。

```ts
beforeEach(async () => {
  // 依存しているサービスクラスのモックオブジェクトを作成する
  const fakeUsersService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    // logInsert 関数などは不要であるため、強制的に型識別させるため `as User` を使う
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password } as User),
  };

  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      // 依存クラスに対して、DIコンテナに登録するオブジェクトを指定する
      { provide: UsersService, useValue: fakeUsersService },
    ],
  }).compile();

  // DIコンテナから対象のサービスクラスのインスタンスを取得する
  service = module.get(AuthService);
});
```

これでテストを合格させることができる。

### SignUp

ユーザーの登録をテストするためには、登録されたユーザーが意図通りハッシュ化されていることを確認する必要がある。そのため、以下のように与えられたパスワードがハッシュ化されて、`.` で分割できることを確認する。

```ts
it('...', async () => {
  const user = await this.service.signup('asdf@asdf.com', 'asdf');

  expect(user.password).not.toEqual('asdf');
  const [salt, hash] = user.password.split('.');
  expect(salt).toBeDefined();
  expect(hash).toBeDefined();
});
```

### Mock

`UsersService` をモックする際には、固定値を返すようにしているが、これでは柔軟にテストを実行することができない。

モックする際には、極力モック対象のオブジェクトの振る舞いを再現することが重要になるが、`UsersService` のユーザーを作成し、検索する機能を再現するためには、データベースの代わりにオンメモリにユーザーを管理するようにし、オンメモリのオブジェクトの検索や要素の追加を実施すればいい。

```ts
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
```

### Controller

コントローラーの処理をテストする場合には、デコレーターで担保している機能を再現することが重要となる。

```ts
@Post('/signin')
async signin(@Body() body: CreateUserDTO, @Session() session: any) {
  const user = await this.authService.signin(body.email, body.password);
  session.userId = user.id;
  return user;
}
```

あくまでもデコレーターは TypeScript の機能であるため、第 1 引数で指定されている HTTP リクエストのボディや、第 2 引数のセッションオブジェクトを自前で用意する必要がある。

そこで以下のようにテスト内でオブジェクトを用意する必要がある。

```ts
it('signin update session object and returns user', async () => {
  const session = { userId: -10 };
  const user = await controller.signin(
    { email: 'asdf@asdf.com', password: 'asdf' },
    session,
  );

  expect(user.id).toEqual(1);
  expect(session.userId).toEqual(1);
});
```

## E2E Testing

E2E テストの場合でも、単体テストのサイト同じ容量でアプリケーションの設定を追加していく必要がある。

```ts
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();
});
```

注意点としては、この状態だと `main.ts` で行っているバリデーションやクッキーセッションの設定が反映されない点である。

そこでアプリケーション全体の設定を行う関数を作成し、テスト用サーバーにも適用することで、設定を反映できるようにする。

```ts
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['sldjhfas'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
```

後はこの関数をテストからも呼び出せば設定を反映させることができる。

### App Module

別途設定を行う関数を用意する以外の方法としては、テストで読み込んでいる `AppModule` 自体にクッキーセッションとバリデーションの設定を追加する方法が存在している。

例えば以下では `providers` に対してアプリケーション全体の設定であるバリデーションを追加している。

```ts
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Reports],
      synchronize: true,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
});
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasdf'],
        }),
      )
      .forRoutes('*');
  }
}
```

また `configure` 関数内で全てのルートに対してクッキーセッションを使用する設定を追加していることがわかる。

## Application Configuration

### Dotenv

`dotenv` を使用することで、`.env` ファイルを開発・テスト用に作成して、それぞれの環境にだけ適用したい環境変数などを指定することができる。

```bash
npm install @nestjs/config cross-env
```

ここで以下のような環境設定ファイルを作成する。

```bash
# .env.development
DB_NAME=db.sqlite

# .env.test
DB_NAME=test.sqlite
```

これで後は npm コマンドを実行した際に環境変数を設定できるように、以下のようにコマンドを編集する必要がある。

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development nest start"
  }
}
```

### jest setup

テストを実行する際に、各テストで使用されたデータベース用のファイルを削除して新規作成を行う必要がある。

Jest では、各テストの前後に共通する処理を実行する機能が提供されており、`setupFilesAfterEnv` で実行するファイルを指定すれば、そのファイルの内容を実行する必要がある。

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "setupFilesAfterEnv": ["<rootDir>/setup.ts"]
}
```

ここで以下のように、テストの実行前に前回のテストで使用された `test.sqlite` を削除し、テストが終了した後に、データベースファイルへの接続を切断する必要がある。

```ts
import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});

global.afterEach(async () => {
  const conn = await getConnection();
  await conn.close();
});
```

これで各テストの依存関係を無くした状態を実現できる。

### ConfigModule

`@nestjs/config` を使用すればアプリケーションの設定を行う際に環境設定用のファイルを指定することができる。

実際に以下のように環境変数の値を使用して、環境変数ファイルを読み込む設定を追加する。

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // ...
  ],
  // ...
})
export class AppModule {
  // ...
}
```

これでアプリケーション全体に読み込ませた環境設定ファイルの内容を反映させることができた。

後は環境変数ファイルに指定されているデータベースファイルの名称を、TypeORM の設定をする際に読み込むことができればいい。

これは `useFactory` を使用して環境設定を注入して、そこから取得した値で使用するデータベースファイルを指定すればいい。

```ts
@Module({
  imports: [
    // ...
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Reports],
          synchronize: true,
        };
      },
    }),
  ],
  // providers: ...
})
export class AppModule {
  // ...
}
```

これで E2E テストからは、アプリケーションの設定を読み込むだけでテストの設定も変更することができるようになった。

## Report

### Create Report

新しくレポートを作成するためのエンドポイントを用意する。

ログインしているユーザーしかアクセスすることができないように、以下のように `AuthGuard` をエンドポイントに対して付与する。

```ts
@Post()
@UseGuards(AuthGuard)
createReport(@Body() body: CreateReportDTO) {
  return this.reportsService.create(body);
}
```

この時の HTTP リクエストを格納するクラスに対しては、文字列や数字の判定以外にも、以下のように数値の最小値・最大値を検証したり、緯度や経度の値が正しいのか検証することができる。

```ts
export class CreateReportDTO {
  @IsString()
  make: string;

  // ...

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  // ...

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  // ...
}
```

### Associations

ユーザーとレポートの関係性を考えると、ユーザーは 0 個以上のレポートを作成することができ、レポートには必ず作成したユーザーが 1 人紐づいているはずである。

こうした 1 対多の表現を TypeORM で表現するには、特定のアノテーションを使用する必要がある。

```ts
// users.entity.ts
import { OneToMany } from 'typeorm';

export class User {
  // ...

  // ユーザーは複数のレポートを所持することができる
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}

// -----------------

// reports.entity.ts
import { ManyToOne } from 'typeorm';

export class Report {
  // ...

  // レポートは必ず1人のユーザーが紐づいている
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
```

これでユーザーエンティティとレポートエンティティの関係性を表現することができた。

### Save Associations

ではレポートを作成する際に、レポートを作成したユーザーに関する情報も保存するように処理を変更する。

これはレポートエンティティに新しく追加したユーザーの関係性に合わせて、レポジトリを通して作成したインスタンスに対してユーザー情報を付与すればいい。

まずはハンドラーを起動した際に、送信されたユーザー情報をセッションから取得するように変更を加える。

```ts
createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
  return this.reportsService(body, user);
}
```

次に作成されたインスタンスに対してユーザーを紐づける。

```ts
create(reportDTO: CreateReportDTO, user: User) {
  const report = this.repo.create(reportDTO);
  report.user = user;
  return this.repo.save(report);
}
```

これでユーザーと作成されたレポートを紐づけた状態で保存し、追加した内容をクライアントに返すことができるようになった。

### Formatting Response

クライアントに返される情報はユーザーインスタンスの中身そのままの状態になってしまうため、パスワードなどの情報も含まれてしまう。

そこでインターセプターと DTO を組み合わせてクライアントに返す情報を制御する必要がある。

```ts
export class ReportDTO {
  @Expose()
  id: number;

  // ...

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
```

これでユーザーインスタンスのプロパティである `id` を `userId` という名称に変換してクライアントに返すことが可能となる。

後は以下のようにシリアライズ用の DTO の指定すればいい。

```ts
@Serialize(ReportDTO)
createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
  return this.reportsService.create(body, user);
}
```

## Authorization

レポートに関して、ログインしているユーザーであるなら誰でもレポートを作成するようにし、管理者権限でログインしているユーザーのみがレポートの承認を行えるような認可機能を追加する。

### default column

TypeORM では、インスタンスを作成する際に対象のカラムのデフォルト値を設定することができる。

```ts
export class Report {
  // ...

  @Column({ default: false })
  approved: boolean;
}
```

後は以下のようにサービスクラス内部で変更対象のレポートエンティティの ID と、レポートの承認状態をどの状態に変更するのか指定すればいい。

```ts
async changeApproval(id: string, approved: boolean) {
  const report = await this.repo.findOne(id);
  if (!report) {
    throw new NotFoundException('not found');
  }
  report.approved = approved;

  return this.repo.save(report);
}
```
