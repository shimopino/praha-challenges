# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

以下のようなユーザーとツイートのテーブルを持つSNSを考える。

![](../assets/Likes.png)

ユーザーがツイートに対して「いいね」を実行すると、そのユーザーとツイートが紐づく設計である。

では以下の条件を満たすようなテーブルを設計してみましょう。

- ユーザーは1つのツイートに対して1つの「いいね」を実行できる
- 「いいね」は解除できる
- ツイートに紐づく「いいね」の数を数えることができる

<details>
<summary>回答例</summary>



</details>


## #2 クイズ

以下のようなテーブル設計を考える。

![](../assets/Likes%20Polymorphic%20Associations.png)

このテーブル設計では以下の仕様を満たすようにしている。

- ユーザーは投稿された記事に対して「いいね」をすることができる。
- ユーザーはコメントに対して「いいね」をすることができる。

ただし現状の設計だと以下のように紐づけ対象のカラムに `NULL` が入り込んでしまう可能性がある。

```bash
+------+---------+----------+------------+
|   id | user_id |  post_id | comment_id |
+------+---------+----------+------------+
|    1 |       3 |        1 |       NULL |
|    2 |       5 |     NULL |          2 |
|    3 |      10 |        2 |       NULL |
|    4 |       1 |        5 |       NULL |
|    5 |       2 |     NULL |          1 |
+------+---------+----------+------------+
```

<details>
<summary>回答例</summary>

Polumorphic Associations

</details>
