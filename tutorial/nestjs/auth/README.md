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

```bash
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```
