# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

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
    id INT PRIMARY KEY,
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

INSERT INTO MessageTree (id, ancestor, descendant)
VALUES
    ( 1, 1, 1),
    ( 2, 1, 2),
    ( 3, 1, 3),
    ( 4, 2, 2),
    ( 5, 2, 4),
    ( 6, 2, 5),
    ( 7, 3, 3),
    ( 8, 3, 6),
    (10, 4, 4),
    (11, 5, 5),
    (12, 6, 6),
    (13, 6, 7),
    (14, 7, 7);
```

このデータ構造は以下のようになっている。

```bash
#                   (1)'parent root'
#                     /          \
#  (2) 'intermediate root 1'     (3) 'intermediate root 2'
#      /             \                     |
# (4) 'leaf 1'     (5) 'leaf 2'       (6) 'leaf 3'
#                                          |
#                                     (7) 'leaf 4'
```

### 課題1 全階層からのメッセージ抽出が難しい




