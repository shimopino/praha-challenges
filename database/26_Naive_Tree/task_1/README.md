# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 全階層からのメッセージ抽出が難しい](#%E8%AA%B2%E9%A1%8C1-%E5%85%A8%E9%9A%8E%E5%B1%A4%E3%81%8B%E3%82%89%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E6%8A%BD%E5%87%BA%E3%81%8C%E9%9B%A3%E3%81%97%E3%81%84)
  - [課題2 ノードの削除が難しい](#%E8%AA%B2%E9%A1%8C2-%E3%83%8E%E3%83%BC%E3%83%89%E3%81%AE%E5%89%8A%E9%99%A4%E3%81%8C%E9%9B%A3%E3%81%97%E3%81%84)
  - [注意点](#%E6%B3%A8%E6%84%8F%E7%82%B9)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定

Slackのようなチャットアプリで使用するメッセージのやり取りを考える。

- ユーザーはメッセージを送信することができる
- ユーザーはメッセージを起点にスレッドという形で、メッセージに対するメッセージを送信することができる

この仕様を満たすために、以下のようにメッセージ自身を親にもつ自己参照のテーブルを設計している。

```puml
entity Message {
    * id: varchar
    ---
    + parent_message_id: varchar [FK]
    text: varchar
}

Message }o--|| Message
```

![](../assets/problem.png)

ではこのテーブル設計で発生する問題を、CRUD操作の観点や将来的な仕様変更への耐性から考えていく。

なお下記のテーブル設計を使用していく。

```sql
CREATE TABLE IF NOT EXISTS Message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255),
    parent_message_id INT,
    FOREIGN KEY (parent_message_id)
        REFERENCES Message(message_id)
) ENGINE=InnoDB;

INSERT INTO Message (text, parent_message_id)
VALUES
    ('parent root', NULL),
    ('intermediate root 1', 1),
    ('intermediate root 2', 1),
    ('leaf 1', 2),
    ('leaf 2', 2),
    ('leaf 3', 3),
    ('leaf 4', 6);
```

格納されているデータとしては以下を想定している。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    ├── (4) leaf 1
#  │    └── (5) leaf 2
#  │
#  └── (3) intermediate root 2
#       └── (6) leaf 3
#            └── (7) leaf 4

+------------+---------------------+-------------------+
| message_id | text                | parent_message_id |
+------------+---------------------+-------------------+
|          1 | parent root         |              NULL |
|          2 | intermediate root 1 |                 1 |
|          3 | intermediate root 2 |                 1 |
|          4 | leaf 1              |                 2 |
|          5 | leaf 2              |                 2 |
|          6 | leaf 3              |                 3 |
|          7 | leaf 4              |                 6 |
+------------+---------------------+-------------------+
```

### 課題1 全階層からのメッセージ抽出が難しい

メッセージは親テーブルとして自身を参照する階層構造を有しているため、1レコード内に全ての子ノードを含めようとすると、階層分の外部結合が必要になってしまう。

例えば以下のクエリでは、自分自身を含めて3階層分のノードを有しているメッセージIDが `3` のノードを見てみると、直近の子ノードであるメッセージIDが `6` のノードしか抽出できていない。

```sql
SELECT m1.message_id, m1.parent_message_id
      ,m2.message_id, m2.parent_message_id
FROM Message m1
LEFT OUTER JOIN Message m2 ON m1.message_id = m2.parent_message_id
WHERE m1.message_id =  3;

+------------+-------------------+------------+-------------------+
| message_id | parent_message_id | message_id | parent_message_id |
+------------+-------------------+------------+-------------------+
|          3 |                 1 |          6 |                 3 |
+------------+-------------------+------------+-------------------+
```

1レコード内に3階層分のノードを追跡したい場合には、以下のようにさらに外部結合を行う必要がある。

```sql
SELECT m1.message_id, m1.parent_message_id
      ,m2.message_id, m2.parent_message_id
      ,m3.message_id, m3.parent_message_id
FROM Message m1
LEFT OUTER JOIN Message m2 ON m1.message_id = m2.parent_message_id
LEFT OUTER JOIN Message m3 ON m2.message_id = m3.parent_message_id
WHERE m1.message_id =  3;

+------------+-------------------+------------+-------------------+------------+-------------------+
| message_id | parent_message_id | message_id | parent_message_id | message_id | parent_message_id |
+------------+-------------------+------------+-------------------+------------+-------------------+
|          3 |                 1 |          6 |                 3 |          7 |                 6 |
+------------+-------------------+------------+-------------------+------------+-------------------+
```

このように1レコード内で全ての階層分のノードを抽出することが難しい。

### 課題2 ノードの削除が難しい

例えば現在のデータから左側のサブツリー全体 (`intermediate root 1`以下) を削除する場合、クエリを何度も実行する必要がある。

まずは `intermediate root 1` のノードのIDを確認してみる。

```sql
SELECT * FROM Message WHERE text = 'intermediate root 1';

+------------+---------------------+-------------------+
| message_id | text                | parent_message_id |
+------------+---------------------+-------------------+
|          2 | intermediate root 1 |                 1 |
+------------+---------------------+-------------------+
```

対象のノード以下のツリーを削除するには、対象のノードを親に持つノードを順番に検索していく必要がある。

```sql
SELECT * FROM Message WHERE parent_message_id = 2; -- (4, 5)が返る
SELECT * FROM Message WHERE parent_message_id = 4; -- Empty
SELECT * FROM Message WHERE parent_message_id = 5; -- Empty

DELETE FROM Message WHERE message_id = 4; -- 子ノードから順番に削除していく
DELETE FROM Message WHERE message_id = 5;
DELETE FROM Message WHERE message_id = 2;
```

このようにノードを削除するために、子ノードまで全てを検索して子ノードから順番に削除していく処理は、データの階層が深くなるに連れてますます複雑なクエリになってしまう。

### 注意点

MySQL8.0からは、**共通テーブル式 (Common Table Expression : CTE)** が導入されたため、各ノードとその階層や子ノードを抽出することができる。

例えば以下のクエリを実行すれば各メッセージの内容を階層付きで抽出できる。

```sql
WITH RECURSIVE MessageTree AS (
        SELECT *, 0 AS depth FROM Message
        WHERE parent_message_id IS NULL
    UNION ALL
        SELECT m.*, mt.depth + 1 AS depth FROM MessageTree mt
        INNER JOIN Message m ON mt.message_id = m.parent_message_id 
)
SELECT * FROM MessageTree;

+------------+---------------------+-------------------+-------+
| message_id | text                | parent_message_id | depth |
+------------+---------------------+-------------------+-------+
|          1 | parent root         |              NULL |     0 |
|          2 | intermediate root 1 |                 1 |     1 |
|          3 | intermediate root 2 |                 1 |     1 |
|          4 | leaf 1              |                 2 |     2 |
|          5 | leaf 2              |                 2 |     2 |
|          6 | leaf 3              |                 3 |     2 |
|          7 | leaf 4              |                 6 |     3 |
+------------+---------------------+-------------------+-------+
```

また以下のクエリを実行すれば、`message_id=3` に紐づくメッセージとその子ノードを全て抽出することができる。

```sql
WITH RECURSIVE MessageTree AS (
    SELECT * FROM Message WHERE message_id = 3
    UNION ALL
    SELECT Message.* FROM Message
    INNER JOIN MessageTree ON Message.parent_message_id = MessageTree.message_id
)
SELECT * FROM MessageTree;

+------------+---------------------+-------------------+
| message_id | text                | parent_message_id |
+------------+---------------------+-------------------+
|          2 | intermediate root 1 |                 1 |
|          4 | leaf 1              |                 2 |
|          5 | leaf 2              |                 2 |
+------------+---------------------+-------------------+
```

参考資料

- [SQL: ナイーブツリーと再帰クエリ](https://blog.amedama.jp/entry/2016/05/05/215954)
- [13.2.15 WITH (Common Table Expressions)](https://dev.mysql.com/doc/refman/8.0/en/with.html)
- [MySQL 8.0 Lab版: MySQLの (再帰)共通テーブル式(CTE)](https://yakst.com/ja/posts/4322)
- [MySQL 8.0の再帰With句のサンプル集](https://codezine.jp/article/detail/2679)
