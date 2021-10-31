# Authentication App

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

<<<<<<< Updated upstream

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
      > > > > > > > Stashed changes

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
