<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [認証 / 認可](#%E8%AA%8D%E8%A8%BC--%E8%AA%8D%E5%8F%AF)
  - [概要](#%E6%A6%82%E8%A6%81)
  - [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
  - [Passport Strategy](#passport-strategy)
  - [ユーザー検索処理](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E6%A4%9C%E7%B4%A2%E5%87%A6%E7%90%86)
  - [認証処理](#%E8%AA%8D%E8%A8%BC%E5%87%A6%E7%90%86)
  - [Passport Local](#passport-local)
  - [Built-in Passport Guard](#built-in-passport-guard)
  - [Login Route](#login-route)
  - [JWT の利用](#jwt-%E3%81%AE%E5%88%A9%E7%94%A8)
  - [Passport JWT](#passport-jwt)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 認証 / 認可

## 概要

`@nestjs/passport` では以下の流れで認証処理を実装することができる。

1. 認証情報を検証することでユーザーを認証する
   - ユーザー名とパスワード、JWT、トークンなど
2. 認証状態を管理する
   - JWT などのトークンを発行する、あるいは Express Session を使う
3. HTTP リクエストに認証されたユーザー情報を付与して、ルーティングに使用する

今回は RESTful API 形式での認証処理を実装する。

## 環境構築

まずは必要なライブラリをインストールする。

```bash
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```

## Passport Strategy

`@nestjs/passport` を使用することで、ライブラリが提供している `PassportStrategy` クラスを継承することで認証処理を実装することができる。

まずは認証処理を実装するモジュールを作成する。

```bash
nest generate module auth
nest generate service auth
```

認証処理を実装するにあたって、ユーザーの検索処理などが必要となるため、追加でモジュールを作成する。

```bash
nest generate module users
nest generate service users
```

## ユーザー検索処理

インメモリにユーザー情報を保存して、指定されたユーザー名をもとにユーザーを検索する処理を追加する。

```ts
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
```

またユーザーモジュールの設定では、認証モジュールでユーザー検索処理を使用するため、以下のように外部モジュールにサービスクラスを追加する。

```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## 認証処理

認証処理では、クライアントから送信されたユーザー名をもとにユーザーを取得し、送信されたパスワードと保存されているパスワードが一致しているのか検証処理を実施する。

```ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
```

上記ではユーザーに関するサービスクラスを使用しているため、以下のようにモジュール設定でユーザーモジュールを読み込んでおく必要がある。

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
```

## Passport Local

認証処理を実装するには `PassportStrategy` クラスを継承する必要がある。

また `validate` メソッドを実装すれば、この処理を認証時に実行することができ、どの認証戦略でもユーザーが存在していることと認証情報が有効であることを検証する必要がある。

```ts
// auth/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

これで `validate` メソッドの実行が成功すれば、`Request` オブジェクトに対して `user` プロパティに認証されたユーザー情報が登録される。

あとは外部のモジュールで使用できるように以下のようにモジュールの設定を追加する。

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

## Built-in Passport Guard

`Guard` では HTTP リクエストが対象のルートハンドラーで処理するかどうかを制御することができる。

`@nestjs/passport` で `Guard` を使用するにあたって、まずは以下の 2 つの状態とその対策を考える必要がある。

1. ユーザーがログインしていない状態
   - `Guard` を使用して認証されていないユーザーのアクセスを制限する
   - ログインするためのルートハンドラーを用意する
2. ユーザーがログインしている状態

## Login Route

認証されていないユーザーがログインするために `/auth/login` のルートハンドラーを用意する必要がある。

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
```

`@UseGuards(AuthGuard('local'))` を指定することで引数に指定した戦略で認証を実施することが可能となる。

`LocalStrategy` クラスに実装した `validate` メソッドが実行されることで、ユーザーが認証された場合は `Request` オブジェクトに対して `user` オブジェクトを付与するため、ハンドラーの中からもユーザーの情報を取得することが可能となる。

これでサーバを起動して以下のリクエストを送信すると、ハンドラーで定義されている通り、ユーザー情報を取得することができる。

```bash
curl http://localhost:3000/auth/login \
  -X POST \
  -d '{"username": "john", "password": "changeme"}' \
  -H "Content-Type: application/json"
```

なおここではデフォルトで用意されている `AuthGuard` を使用しただけであったため、以下のように自作したクラスで代用する形式に変更する。

```ts
// auth/local-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

あとは以下のように変更すればいい。

```ts
@UseGuards(LocalAuthGuard)
@Post('auth/login')
async login(@Request() req) {
  return req.user;
}
```

## JWT の利用

JWT は以下のように使用する。

- ユーザー名とパスワードの認証が終了したあとは、JWT を発行し、後続のリクエスト時に使用する
- `bearer token` として有効な JET トークンの存在を検証して、ルートハンドラーの処理を制御する

```bash
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

では `POST /auth/login` の処理の流れを簡単に見ていく。

1. `AuthGuard` を使用することで、有効なユーザーのみだけルートハンドラーを発火させる
2. `req` オブジェクトに `user` 情報が付与される

そこで以下のようにログイン時に JWT トークンを発行する処理を追加する。

```ts
// auth/auth.service.ts

async login(user: any) {
  const payload = {username: user.username, sub: user.userId};
  return {
    access_token: this.jwtService.sign(payload)
  }
}
```

`sign` メソッドでは、指定されたユーザー情報をもとに JWT トークンを発行する処理を実行でき、生成されたトークンをクライアントに返す。

あとは以下のようにサービスクラスを指定すればいい。

```ts
// auth/auth.module.ts

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, JwtService],
})
export class AuthModule {}
```

あとは暗号化を行うためのキー情報を以下のように用意しておく。

```ts
// auth/constants.ts

export const jwtConstants = {
  secret: 'secretKey',
};
```

次にモジュール設定の中に、トークンの有効期限や暗号化のためのキーを指定すればいい。

```ts
// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

あとはルートハンドラーから生成されたトークンをクライアントに返すように処理を変更する。

```ts
// app.controller.ts

import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
```

あとはこのルートハンドラーに対して以下のようにリクエストを送信してみる。

```bash
curl http://localhost:3000/auth/login \
  -X POST \
  -d '{"username": "john", "password": "changeme"}' \
  -H "Content-Type: application/json"
```

これで以下のようなトークンを取得することができる。

```bash
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTYzNjM3OTc5NSwiZXhwIjoxNjM2Mzc5ODU1fQ.X0zYuiHmyIT1dmP_qQV3cTnPNgmpBqbxU9idykyjMfg"}%
```

## Passport JWT

JWT トークンの発行処理は完了したので、`passport-jwt` を使用してルートハンドラーに対するアクセス制御を追加する。

このためには、`LocalStrategy` の時と同じように、`validate` メソッドを実装する。

```ts
// auth/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

`super` メソッド内で検証処理の設定を追加することができる。

- `jwtFromRequest`
  - `Request` オブジェクトから JWT トークンを抽出する方法を指定する
  - ここでは `Bearer Token` から取得できるようにしている
- `ignoreExpiration`
  - JWT の有効期限を適用する
  - トークンの有効期限が切れていた場合は `401` を返す
- `secretOrKey`
  - 暗号化するためのキー情報を指定する

あとは以下のように自作の `Guard` を適用すればいい。

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
