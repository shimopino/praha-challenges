# 課題 2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [husky](#husky)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## husky

[husky](https://typicode.github.io/husky/#/) を利用した Git Hook の検証は、[praha-challenged-ddd](https://github.com/shimopino/praha-challenges-ddd) で実施する。

今回は以下の手順で pre-commit hook を登録している。

````bash
❯❯❯ npm install --save-dev husky

❯❯❯ npx husky install

# これで以下のディレクトリ構成で初期化される
# .husky
# └── _
#     ├── .gitignore
#     └── husky.sh

❯❯❯ npm set-script prepare "husky install"

# package.jsonに下記のコマンドが追加される
# {
#   "scripts": {
#     "prepare": "husky install"
#   }
# }

❯❯❯ npx husky add .husky/pre-commit "npm run lint"

# pre-commitフックを実現するためのファイルが新しく登録される
# .husky
# ├── _
# │   ├── .gitignore
# │   └── husky.sh
# └── pre-commit

# pre-commitの中身は下記になる
#   ```
#   #!/bin/sh
#   . "$(dirname "$0")/_/husky.sh"
#
#   npm run lint
#   ```
````

実際にコミットを行い、linter による検証処理が実行されるのか検証する。

その結果、下記のようにコミット前に linter でエラーが発生する様な状況の場合に、コミットが失敗していることがわかる。

```bash
❯❯❯ git add package-lock.json package.json .husky/
❯❯❯ git commit -m "feat: pre-commit hookを登録"

> praha-challenges-ddd@0.0.1 lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix


/Users/shimopino/Desktop/praha/work/praha-challenges-ddd/src/domain/participant/entity/__tests__/Participant.factory.ts
  1:40  error  Unexpected empty arrow function  @typescript-eslint/no-empty-function

/Users/shimopino/Desktop/praha/work/praha-challenges-ddd/test/participants.e2e-spec.ts
  32:3   warning  Test has no assertions                                                               jest/expect-expect
  33:11  warning  'expected' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Users/shimopino/Desktop/praha/work/praha-challenges-ddd/test/tasks.e2e-spec.ts
  31:3  warning  Test has no assertions  jest/expect-expect

/Users/shimopino/Desktop/praha/work/praha-challenges-ddd/test/utils/TestFactory.ts
  6:7  warning  'creator' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

✖ 5 problems (1 error, 4 warnings)

husky - pre-commit hook exited with code 1 (error)
```

## pre-commit の課題

pre-commit フックの設定自体は、チーム内の各個人のローカル作業環境で実施する必要があるため、作業漏れなどが発生してしまうと、リモートにプッシュされたコミットが pre-commit で設定している検証内容が実施されたものなのか確かめる方法はない。

また、pre-commit フックは以下のコマンドを使用すれば検証せずにコミットしてしまうことも可能である。

```bash
❯❯❯ git commit --no-verify
```

そのため、pre-commit フックによる品質向上は可能であれば実施するくらいの温度感でいいと感じている。リモートリポジトリ環境での CI を実行であれば、必ず linter による検証処理を実施させることが可能であるため、pre-commit フックよりも優先的に構築した方がいいと考えている。
