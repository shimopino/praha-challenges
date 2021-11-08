<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [認証 / 認可](#認証--認可)
  - [概要](#概要)
  - [環境構築](#環境構築)
  - [Passport Strategy](#passport-strategy)
  - [ユーザー検索処理](#ユーザー検索処理)
  - [認証処理](#認証処理)
  - [Passport Local](#passport-local)

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
