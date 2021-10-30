# NestJS tutorial: Messages

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [NestJS tutorial: Messages](#nestjs-tutorial-messages)
  - [CLI](#cli)
    - [Module](#module)
    - [Controller](#controller)
  - [Validation Pipe](#validation-pipe)
    - [implement ValidationPipe](#implement-validationpipe)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## CLI

### Module

`nestjs` では CLI を使用して特定のクラスを作成することができる。

```bash
# module を作成するコマンド
# XXXModule のような接尾語は不要
nest generate module messages

# 以下の構成が作成される
# src
# └─ messages
#    └─ messages.module.ts
```

これで以下のような設定がされていないファイルが作成される。

```ts
import { Module } from '@nestjs/common';

@Module({})
export class MessagesModule {}
```

### Controller

コントローラー層は以下のように作成する。

```bash
# controller を作成するコマンド
# この場合はどのフォルダに配置するのかも含めて指定する
# <どのフォルダに配置するのか>/<クラス名をどうするのか>
# --flat: controllerフォルダは作成しない
nest generate controller messages/messages --flat
>>
CREATE src/messages/messages.controller.spec.ts (506 bytes)
CREATE src/messages/messages.controller.ts (105 bytes)
UPDATE src/messages/messages.module.ts (182 bytes)

# 以下の構成で作成される
# src
# └── messages
#     ├── messages.controller.spec.ts
#     ├── messages.controller.ts
#     └── messages.module.ts
```

## Validation Pipe

### implement ValidationPipe

HTTP リクエストに対して、ユーザーが入力した値が格納されている HTTP ボディの値を検証したい場合、以下のように `ValidationPipe` をアプリケーション全体の設定として追加する必要がある。

```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  // HERE
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

バリデーションのためのルールを作成するためには、まずは必要なライブラリをインストールする。

```bash
npm install class-validator class-transformer
```

ここで HTTP リクエストのボディに対して検証処理を実装するために、まずは HTTP ボディに対応するクラスを作成する必要がある。

```ts
import { IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  content: string;
}
```

ここで作成したクラスを以下のように、対応するルーティング処理の引数の型に指定すればいい。

```ts
@Post()
createMessage(@Body() body: CreateMessageDTO) {
  console.log(body);
}
```

こうすることで対応する HTTP ボディが文字列ではなく `null` や `number` であった場合には以下のようなエラーコードが返ってくる。

```bash
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-Qdav3CHrWuLq389QYvm9FiaGfE0"
Date: Sat, 30 Oct 2021 14:08:43 GMT
Connection: close

{
  "statusCode": 400,
  "message": [
    "content must be a string"
  ],
  "error": "Bad Request"
}
```

なお、この時に使用した各ライブラリの役割は以下のようになっている。

- `class-transformer`
  - HTTP ボディの中身を指定したクラスのインスタンスに変換する
- `class-validator`
  - 変換されたインスタンスの各プロパティに対して、指定されたアノテーションに該当する検証処理を実行する
  - 検証処理に違反した場合は、その時点でステータスコードが 400 系のコードでレスポンスを返す
