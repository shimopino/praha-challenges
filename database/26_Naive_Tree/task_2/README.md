# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [閉包テーブル (Closure Table)](#%E9%96%89%E5%8C%85%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB-closure-table)
  - [課題1 全階層からのメッセージ抽出が難しい](#%E8%AA%B2%E9%A1%8C1-%E5%85%A8%E9%9A%8E%E5%B1%A4%E3%81%8B%E3%82%89%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E6%8A%BD%E5%87%BA%E3%81%8C%E9%9B%A3%E3%81%97%E3%81%84)
  - [課題2 ノードの削除が難しい](#%E8%AA%B2%E9%A1%8C2-%E3%83%8E%E3%83%BC%E3%83%89%E3%81%AE%E5%89%8A%E9%99%A4%E3%81%8C%E9%9B%A3%E3%81%97%E3%81%84)
  - [課題3 サブツリーの移動](#%E8%AA%B2%E9%A1%8C3-%E3%82%B5%E3%83%96%E3%83%84%E3%83%AA%E3%83%BC%E3%81%AE%E7%A7%BB%E5%8B%95)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 閉包テーブル (Closure Table)

この問題は **ナイーブツリー** と呼ばれており、ノードの直近の親と子だけを抽出する用途以外では、複雑なクエリが必要になってしまうアンチパターンである。

この問題を解決する方法はいくつか存在しているが、シンプルな手法は **閉包テーブル (Closure Table)** であり、各ノードが有しているデータとノード同士の関係性を別々のテーブルで表現する方法である。

具体的には以下のようなノード間の関係性だけをもつテーブルを導入する。

```puml
entity Message {
    * message_id: varchar [PK]
    ---
    text: varchar
}

entity MessageTree {
    * id: varchar
    ---
    + ancestor: varchar [FK]
    + descendant: varchar [FK]
}

Message ||--o{ MessageTree
```

![](../assets/answer.png)

この関係性は以下のように定義することができる。

```sql
CREATE TABLE IF NOT EXISTS Message (
    message_id INT PRIMARY KEY,
    text VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS MessageTree (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ancestor INT,
    descendant INT,
    UNIQUE(ancestor, descendant),
    FOREIGN KEY (ancestor)
        REFERENCES Message(message_id),
    FOREIGN KEY (descendant)
        REFERENCES Message(message_id)
) ENGINE=InnoDB;
```

なお `MessageTree` にはノード自身への参照も含めたノードの組み合わせを追加する。

```sql
INSERT INTO Message (message_id, text)
VALUES
    (1, 'parent root'),
    (2, 'intermediate root 1'),
    (3, 'intermediate root 2'),
    (4, 'leaf 1'),
    (5, 'leaf 2'),
    (6, 'leaf 3'),
    (7, 'leaf 4');

INSERT INTO MessageTree (ancestor, descendant)
VALUES
    -- メッセージIDが1は、全ての子孫に対するメッセージへの紐づけをもつ
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    -- メッセージIDが2は、ID3の子孫のみをもつ
    (2, 2),
    (2, 4),
    (2, 5),
    -- メッセージIDが4と5は、自身のIDをもつ
    (4, 4),
    (5, 5),
    -- メッセージIDが3は、自身の全ての子メッセージのIDをもつ
    (3, 3),
    (3, 6),
    (3, 7),
    -- メッセージIDが6は、自身と子メッセージのIDをもつ
    (6, 6),
    (6, 7),
    -- メッセージIDが7は、自身のIDをもつ
    (7, 7);
```

このデータ構造は以下のようになっている。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    ├── (4) leaf 1
#  │    └── (5) leaf 2
#  │
#  └── (3) intermediate root 2
#       └── (6) leaf 3
#            └── (7) leaf 4
```

### 課題1 全階層からのメッセージ抽出が難しい

このテーブル設計にしていれば、 メッセージIDが3のメッセージの子孫となるメッセージを全て取得することができる。

これは以下のように、単純に親となる `ancestor` に抽出元となるメッセージIDを指定すればいい。

```sql
SELECT m.* FROM Message m
INNER JOIN MessageTree mt ON m.message_id = mt.descendant
WHERE mt.ancestor = 3;

+------------+---------------------+
| message_id | text                |
+------------+---------------------+
|          3 | intermediate root 2 |
|          6 | leaf 3              |
|          7 | leaf 4              |
+------------+---------------------+
```

逆に子孫となる `descendant` を指定することで、特定のメッセージIDの親となるメッセージを全て抽出することもできる。

```sql
SELECT m.* FROM Message m
INNER JOIN MessageTree mt ON m.message_id = mt.ancestor
WHERE mt.descendant = 7;

+------------+---------------------+
| message_id | text                |
+------------+---------------------+
|          1 | parent root         |
|          3 | intermediate root 2 |
|          6 | leaf 3              |
|          7 | leaf 4              |
+------------+---------------------+
```

またノードを追加することも簡単にできる。

例えば現在のデータに新たにメッセージを追加して以下の状態にしてみる。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    ├── (4) leaf 1
#  │    └── (5) leaf 2
#  │         └── (8) leaf 5
#  │
#  └── (3) intermediate root 2
#       └── (6) leaf 3
#            └── (7) leaf 4
```

このためには自己参照となる紐づけも合わせて、以下のデータを追加する必要がある。

| ancestor | descendant |
|:--------:|:----------:|
|    1     |     8      |
|    2     |     8      |
|    5     |     8      |
|    8     |     8      |

このためには、自分自身への参照に合わせて、挿入先となるメッセージID (=`5`) を子孫にもつ全てのメッセージID (= `1, 2`) との紐づけも挿入する必要がある。

そのため以下のようにレコードを挿入する際に、別途親となるメッセージを抽出するクエリが必要となる。

```sql
INSERT INTO Message (message_id, text)
VALUES (8, 'leaf 5');

-- SELECT文を使用して抽出した内容でレコードを挿入できる
INSERT INTO MessageTree (ancestor, descendant)
    SELECT mt.ancestor, 8
    FROM MessageTree mt
    WHERE mt.descendant = 5
UNION ALL
    SELECT 8, 8;
```

このクエリを実行すれば以下のように新しくメッセージが挿入されていることが確認できる。

```sql
SELECT * FROM MessageTree mt WHERE mt.descendant = 8;

+----+----------+------------+
| id | ancestor | descendant |
+----+----------+------------+
| 21 |        1 |          8 |
| 22 |        2 |          8 |
| 23 |        5 |          8 |
| 24 |        8 |          8 |
+----+----------+------------+
```

### 課題2 ノードの削除が難しい

このテーブル設計にしていれば、リーフノードを削除することは非常に簡単である。

例えばリーフノードであるメッセージIDが8のノードを削除する場合には、単純に子孫 `descendant` がメッセージIDが8であるノードを全て削除すればいいだけである。

```sql
DELETE FROM MessageTree WHERE descendant = 8;
```

またサブツリーを削除したい場合は、指定した先祖 `ancestor` を有しているレコードの子孫 `descendant` を全て削除すればいい。

これは以下のようなデータを有している際に先祖が `2` であるサブツリーを削除したい場合には、先祖が `2` であるレコードの `descendant` が `4,5,8`を削除すればいいことになる。

```bash
# (1) parent root
#  └── (2) intermediate root 1
#       ├── (4) leaf 1
#       └── (5) leaf 2
#            └── (8) leaf 5
```

つまり以下のように紐づけを削除すればいいことがわかる。

```sql
DELETE FROM MessageTree
WHERE descendant IN (
    SELECT descendant
    FROM MessageTree
    WHERE ancestor = 2
)
AND descedant != 2;

-- 以下のデータが削除される
/*
| ancestor | descendant |
|:--------:|:----------:|
|    2     |     4      |
|    2     |     5      |
|    2     |     8      |
*/
```

なお自己参照は削除しないようにしている。

### 課題3 サブツリーの移動

このテーブル設計にしていれば、サブツリーの削除だけではなく、ほかのメッセージにサブツリー全体を移動させることも可能である。

例えば以下の状態のデータを考える。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    ├── (4) leaf 1
#  │    └── (5) leaf 2
#  │         └── (8) leaf 5
#  │
#  └── (3) intermediate root 2
#       └── (6) leaf 3
#            └── (7) leaf 4
```

この状態からメッセージIDが5を親とした場合のサブツリーを、メッセージIDが3を親としたサブツリーに付け替える。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    └── (4) leaf 1
#  │    
#  └── (3) intermediate root 2
#       ├── (6) leaf 3
#       │    └── (7) leaf 4
#       └── (5) leaf 2
#            └── (8) leaf 5
```

このためにまずは以下のデータを削除する必要がある。

つまり先祖 `ancestor` には1と2を、子孫 `descendant` には5と8を抽出して全パターンのレコードを削除すればいい。

| ancestor | descendant |
|:--------:|:----------:|
|    1     |     5      |
|    1     |     8      |
|    2     |     5      |
|    2     |     8      |

注意点としてはサブツリー内部の紐づけは削除する必要がない点である。

```sql
DELETE FROM MessageTree
WHERE descendant IN (
    -- 別名にしないと ERROR 1093 が発生する
    -- MySQLではWHERE句のサブクエリで指定したテーブル名は
    -- UPDATEできないらしい
    SELECT x.id FROM (
        SELECT descendant AS id
        FROM MessageTree
        WHERE ancestor = 5 -- 先祖が5、つまり子孫には5と8が抽出される
    ) AS x
)
AND ancestor IN (
    SELECT y.id FROM (
        SELECT ancestor AS id
        FROM MessageTree
        WHERE descendant = 5 -- 子孫が5、つまり先祖には自己参照も合わせて1と2と5が抽出される
        AND ancestor != descendant
    ) AS y
);
```

これでより上位の階層との紐づけ `(1, 5), (1, 8), (2, 5), (2, 8` を削除した上で、サブツリー内の紐づけ `(5, 5), (5, 8` は残したままにすることができた。

次にサブツリーを移動させるためには、以下の紐づけを新しく追加する必要がある。

| ancestor | descendant |
|:--------:|:----------:|
|    1     |     5      |
|    1     |     8      |
|    3     |     5      |
|    3     |     8      |

そのためにはデカルト積を使用して全てのノードを組み合わせたうえで、新たな挿入先のメッセージIDが3までのノードと、メッセージIDが5である先祖の全パターンを抽出すればいい。

```sql
INSERT INTO MessageTree (ancestor, descendant)
  SELECT supertree.ancestor, subtree.descendant
  FROM MessageTree AS supertree
    CROSS JOIN MessageTree AS subtree
  WHERE supertree.descendant = 3
    AND subtree.ancestor = 5;
```

試しにメッセージIDが3のノードを親にもつ全ての紐づけを確認してみると、新たにメッセージIDが5と8のノードが追加されていることがわかる。

```sql
SELECT * FROM MessageTree WHERE ancestor = 3;

+----+----------+------------+
| id | ancestor | descendant |
+----+----------+------------+
| 13 |        3 |          3 |
| 30 |        3 |          5 | -- サブツリーの1階層目
| 14 |        3 |          6 |
| 15 |        3 |          7 |
| 31 |        3 |          8 | -- サブツリーの2階層目
+----+----------+------------+
```

つまり期待通り、以下の構造になるようにサブツリーを移動させることができている。

```bash
# (1) parent root
#  ├── (2) intermediate root 1
#  │    └── (4) leaf 1
#  │    
#  └── (3) intermediate root 2
#       ├── (6) leaf 3
#       │    └── (7) leaf 4
#       └── (5) leaf 2
#            └── (8) leaf 5
```
