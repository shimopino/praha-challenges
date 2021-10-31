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
