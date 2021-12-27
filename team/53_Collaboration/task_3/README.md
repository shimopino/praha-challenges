# 課題 3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Gitmoji](#gitmoji)
- [Commitlint](#commitlint)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Gitmoji

コミットメッセージを記述する際の `type` はタイポの可能性が存在する。

そこで `gitmoji-cli` を使用すれば `type` を絵文字として表現することができ、選択形式でもあるためタイポが発生する可能性を少なくすることができる。

詳細は参考記事を参照。

参考記事

- [gitmoji の使い方](https://zenn.dev/ogakuzuko/articles/a160fdd8b4b3b8)

## Commitlint

`commitlint` はコミットメッセージに対して静的解析を実行できるツールである。具体的には `husky` のプレコミットフックのようにコードがコミットされる前にメッセージを解析する処理を実行できる。

デフォルト設定では、**Conventional Commits** の規約に従うようにコミットメッセージを編集する必要がある。

参考記事

- [How to Write Good Commit Messages with Commitlint](https://www.freecodecamp.org/news/how-to-use-commitlint-to-write-good-commit-messages/)
