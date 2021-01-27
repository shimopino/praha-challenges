# CORSについて理解する

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 Quiz](#1-quiz)
- [&#035;2 Quiz](#2-quiz)
- [&#035;3 Quiz](#3-quiz)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 Quiz

Express のエコシステムには CORS の設定を簡単にできるミドルウェアが存在している。

- [https://github.com/expressjs/cors](https://github.com/expressjs/cors)

このミドルウェアを使用して、以下の条件を満たすような CORS を実装してみましょう。

- 許可する Origin は `https://example.com`
- OPTIONS メソッドに対してステータスコードを 200 で返す
- 許可する HTTP メソッドは `PUT` と `POST`
- 上記の CORS は `/users/:id` のAPIに対して実装する

<details>
<summary>回答例</summary>

</details>

## #2 Quiz

最初のクイズと同様に [cors](https://github.com/expressjs/cors) ミドルウェアを使用する。

以下の複数の Origin を許可する CORS を実装してみましょう。

- `https://example1.com`
- `https://example2.com`

なお今回は全てのAPIに対して適用します。

<details>
<summary>回答例</summary>

</details>

## #3 Quiz

<details>
<summary>回答例</summary>
</details>
