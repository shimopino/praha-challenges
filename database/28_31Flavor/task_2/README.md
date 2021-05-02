# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [参照テーブル](#%E5%8F%82%E7%85%A7%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 参照テーブル

この問題は **サーティワンフレーバー** と呼ばれており、有効な値が相互排他的なもの (ON/OFF、RIGHT/LEFTなど) 以外で将来的に変更する可能性があるコード値などを制約として表現にしてしまうアンチパターンである。

解決策としては、生徒の状態の状態を制約ではなく **参照テーブル** で設定する方法が存在する。

```puml
entity Student {
    * student_id: varchar [PK]
    ---
    name: varchar
    + status: varchar [FK]
}

entity StudentStatus {
    * status_id: varchar [PK]
    ---
    name: varchar
}

Student }o--|| StudentStatus
```

![](../assets/answer.png)

この関係性は以下のように定義することができる。

```sql
CREATE TABLE IF NOT EXISTS StudentStatus (
    status_id INT PRIMARY KEY,
    name VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Student (
    student_id INT PRIMARY KEY,
    name VARCHAR(255),
    status_id INT,
    FOREIGN KEY (status_id)
        REFERENCES StudentStatus(status_id)
) ENGINE=InnoDB;
```

では以下のデータを事前に準備しておく。

```sql
INSERT INTO StudentStatus (status_id, name)
VALUES
    (1, 'studying'),
    (2, 'graduated'),
    (3, 'suspended'),
    (4, 'transferred');

INSERT INTO Student (student_id, name, status_id)
VALUES
    (1, 'John', 1),
    (2, 'Mike', 2),
    (3, 'Lisa', 3),
    (4, 'Keisuke', 4);
```

