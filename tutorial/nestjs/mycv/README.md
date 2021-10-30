# Authentication App

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Authentication App](#authentication-app)
  - [init](#init)
  - [ORM](#orm)

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
