# NestJS tutorial: Messages

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [CLI](#cli)
  - [Module](#module)
  - [Controller](#controller)
- [Validation Pipe](#validation-pipe)

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
