# 課題4 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [概要](#%E6%A6%82%E8%A6%81)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概要

以下の記事で構築しているAPIに対して、単体テストを実装することを考えましょう。

- [Building a Node.js/TypeScript REST API, Part 1: Express.js](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1)
- [Building a Node.js/TypeScript REST API, Part 2: Models, Middleware, and Services](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-2)

上記の記事でどのようなAPIが構築されているのか知りたい場合には、[SPEC.md](./SPEC.md) を参照してください。

なおわかりやすさのために一部の実装が元の記事とは異なる部分もあります。

もしもこのディレクトリの環境を0から構築したい場合は、[ENVIRONMENT.md](./ENVIRONMENT.md) を参照してください。

## #2 クイズ

[src/users/daos/users.dao.ts] にはユーザのリソースに関するCRUD処理が実装されており、データベースのモジュールとしては [nedb](https://github.com/louischatriot/nedb/) を使用してローカルの特定のファイルに実行結果を保存するようにしています。

では [test/users/daos/users.dao.test.ts] にCRUD処理の中から1つのメソッドを選択して単体テストを実装してみましょう。

コードカバレッジが100％になることを目指しましょう。
