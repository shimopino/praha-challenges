# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;3 クイズ](#3-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;4 クイズ](#4-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

今回のクイズでは以下のテーブル定義を使用する。

```sql
CREATE TABLE IF NOT EXISTS Sample (
    id INT PRIMARY KEY,
    salary INT 
) ENGINE=InnoDB;

INSERT INTO Sample (id, salary)
VALUES
    (2,  20000),
    (3,  30000),
    (5,  50000),
    (10, 100000),
    (15, 150000),
    (20, 200000);
```
## #1 クイズ

以下のクエリを発行した際にどのレコードに対して共有ロックが取得されるのか確認してみましょう。

```sql
A> START TRANSACTION;
A> SELECT * FROM Sample Where salary >= 50000 AND salary <= 100000 FOR SHARE;
```

<details>
<summary>回答例</summary>
<div>

テーブルの全レコードのインデックスに対して共有ロックが取得される。

```bash
A> SELECT ENGINE_TRANSACTION_ID, LOCK_DATA, OBJECT_NAME, LOCK_MODE, LOCK_STATUS FROM performance_schema.data_locks;

+-----------------------+------------------------+-------------+-----------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA              | OBJECT_NAME | LOCK_MODE | LOCK_STATUS |
+-----------------------+------------------------+-------------+-----------+-------------+
|       421164310855064 | NULL                   | Sample      | IS        | GRANTED     |
|       421164310855064 | supremum pseudo-record | Sample      | S         | GRANTED     |
|       421164310855064 | 2                      | Sample      | S         | GRANTED     |
|       421164310855064 | 3                      | Sample      | S         | GRANTED     |
|       421164310855064 | 5                      | Sample      | S         | GRANTED     |
|       421164310855064 | 10                     | Sample      | S         | GRANTED     |
|       421164310855064 | 15                     | Sample      | S         | GRANTED     |
|       421164310855064 | 20                     | Sample      | S         | GRANTED     |
+-----------------------+------------------------+-------------+-----------+-------------+
```

</div>
</details>

## #2 クイズ

以下のクエリを発行した際にどのレコードに対して共有ロックが取得されるのか確認してみましょう。

```sql
A> START TRANSACTION;
A> SELECT * FROM Sample Where id = 7 FOR SHARE;
```

<details>
<summary>回答例</summary>
<div>

存在しないインデックスに対してロックを取得しようとすると、ギャップロックが発生する。

```bash
A> SELECT ENGINE_TRANSACTION_ID, LOCK_DATA, OBJECT_NAME, LOCK_MODE, LOCK_STATUS FROM performance_schema.data_locks;

+-----------------------+-----------+-------------+-----------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA | OBJECT_NAME | LOCK_MODE | LOCK_STATUS |
+-----------------------+-----------+-------------+-----------+-------------+
|       421164310855064 | NULL      | Sample      | IS        | GRANTED     |
|       421164310855064 | 10        | Sample      | S,GAP     | GRANTED     |
+-----------------------+-----------+-------------+-----------+-------------+
```

</div>
</details>

## #3 クイズ

以下のクエリを発行した際にどのレコードに対して共有ロックが取得されるのか確認してみましょう。

特にトランザクションBの処理に関しては、3パターンについてどのレコードがロックされるのか確認してみましょう。

```sql
A> START TRANSACTION;
A> SELECT * FROM Sample Where salary >= 50000 AND salary <= 100000 FOR SHARE;

B> START TRANSACTION;
B> INSERT INTO Sample (id, salary) VALUES (7, 70000);

B> INSERT INTO Sample (id, salary) VALUES (1, 1000);

B> INSERT INTO Sample (id, salary) VALUES (21, 210000);
```

<details>
<summary>回答例</summary>
<div>

まずはトランザクションAのクエリを実行した段階で、クイズ1と同じくレコード全体にロックが取得される。

```bash
+-----------------------+------------------------+-------------+-----------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA              | OBJECT_NAME | LOCK_MODE | LOCK_STATUS |
+-----------------------+------------------------+-------------+-----------+-------------+
|       421164310855064 | NULL                   | Sample      | IS        | GRANTED     |
|       421164310855064 | supremum pseudo-record | Sample      | S         | GRANTED     |
|       421164310855064 | 2                      | Sample      | S         | GRANTED     |
|       421164310855064 | 3                      | Sample      | S         | GRANTED     |
|       421164310855064 | 5                      | Sample      | S         | GRANTED     |
|       421164310855064 | 10                     | Sample      | S         | GRANTED     |
|       421164310855064 | 15                     | Sample      | S         | GRANTED     |
|       421164310855064 | 20                     | Sample      | S         | GRANTED     |
+-----------------------+------------------------+-------------+-----------+-------------+
```

トランザクションBの1つ目のクエリでは、以下のギャップロックを取得しようとして、トランザクションAのロック解放待機状態となる。

```bash
+-----------------------+------------------------+-------------+------------------------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA              | OBJECT_NAME | LOCK_MODE              | LOCK_STATUS |
+-----------------------+------------------------+-------------+------------------------+-------------+
|                  9832 | NULL                   | Sample      | IX                     | GRANTED     |
|                  9832 | 10                     | Sample      | X,GAP,INSERT_INTENTION | WAITING     |
+-----------------------+------------------------+-------------+------------------------+-------------+
```

トランザクションBの2つ目のクエリでは、以下のギャップロックを取得しようとして、トランザクションAのロック解放待機状態となる。

```bash
+-----------------------+------------------------+-------------+------------------------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA              | OBJECT_NAME | LOCK_MODE              | LOCK_STATUS |
+-----------------------+------------------------+-------------+------------------------+-------------+
|                  9832 | NULL                   | Sample      | IX                     | GRANTED     |
|                  9832 | 2                      | Sample      | X,GAP,INSERT_INTENTION | WAITING     |
+-----------------------+------------------------+-------------+------------------------+-------------+
```

トランザクションBの3つ目のクエリでは、以下のギャップロックを取得しようとして、トランザクションAのロック解放待機状態となる。

```bash
+-----------------------+------------------------+-------------+--------------------+-------------+
| ENGINE_TRANSACTION_ID | LOCK_DATA              | OBJECT_NAME | LOCK_MODE          | LOCK_STATUS |
+-----------------------+------------------------+-------------+--------------------+-------------+
|                  9832 | NULL                   | Sample      | IX                 | GRANTED     |
|                  9832 | supremum pseudo-record | Sample      | X,INSERT_INTENTION | WAITING     |
+-----------------------+------------------------+-------------+--------------------+-------------+
```

</div>
</details>

## #4 クイズ

以下のクエリの実行結果を確認してみましょう。

クイズ3の結果とどのように異なるでしょうか。

```sql
A> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
A> START TRANSACTION;
A> SELECT * FROM Sample Where salary >= 50000 AND salary <= 100000 FOR SHARE;

A> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
B> START TRANSACTION;
B> INSERT INTO Sample (id, salary) VALUES (7, 70000);
```

<details>
<summary>回答例</summary>
<div>

トランザクションの分離レベルが `READ COMMITTED` の場合は、ギャップロックが無効になるため、トランザクションBからインデックスレコードの間に、新たにレコードを挿入することが可能となる。

</div>
</details>