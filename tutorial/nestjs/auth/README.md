<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [認証 / 認可](#%E8%AA%8D%E8%A8%BC--%E8%AA%8D%E5%8F%AF)
  - [概要](#%E6%A6%82%E8%A6%81)
  - [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)

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
