# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#課題1)
  - [デッドロックとは何か](#デッドロックとは何か)
  - [ISOLATION LEVELとは何か](#isolation-levelとは何か)
    - [READ UNCOMMITTED](#read-uncommitted)
    - [READ COMMITTED](#read-committed)
    - [REPEATABLE READ](#repeatable-read)
    - [SERIALIZABLE](#serializable)
  - [行レベルロック、テーブルレベルロックの違いとは何か](#行レベルロックテーブルレベルロックの違いとは何か)
  - [悲観ロックと楽観ロックの違いは何か](#悲観ロックと楽観ロックの違いは何か)
  - [ACIDモデル](#acidモデル)
    - [Atomicity (原子性)](#atomicity-原子性)
    - [Consistency (一貫性)](#consistency-一貫性)
    - [Isolation (独立性)](#isolation-独立性)
    - [Durability (永続性)](#durability-永続性)
  - [Lock Types](#lock-types)
    - [Shared and Exclusive Locks](#shared-and-exclusive-locks)
    - [Intention Locks](#intention-locks)
    - [Record Locks](#record-locks)
    - [Gap Locks](#gap-locks)
    - [Next-Key Locks](#next-key-locks)
    - [Insert Intention Locks](#insert-intention-locks)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## デッドロックとは何か

**デッドロック**とは、他のトランザクションが必要としているロックを、それぞれが保持したままであるために、お互いのトランザクションが続行できない状態のことを表している。

では実際にデッドロックを発生させてみる。

まずはターミナルからMySQLサーバーにアクセスし、トランザクションを開始させた後で、共有ロックを取得する。

```bash
A> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)

A> SELECT * FROM employees WHERE emp_no = 500001 FOR SHARE;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
| 500001 | 1981-01-01 | ccccccc    | ddddddd   | F      | 1991-03-30 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

次に異なるセッションでMySQLサーバーにアクセスして、トランザクションを開始した後で、指定のレコードを削除しようとしてみる。

```bash
B> DELETE FROM employees WHERE emp_no = 500001;
# ここで待機処理が発生する
```

この際に処理を実行した段階で、セッションAが共有ロックを取得しているレコードに対して、占有ロックを取得しようとして、セッションAがロックを解放することを待機している状態である。

ではこの状態でセッションAから指定のレコードを削除してみる。

```bash
A> DELETE FROM employees WHERE emp_no = 500001;
Query OK, 1 row affected (0.01 sec)
```

このときセッションAでの処理は正常に終了するが、セッションBではデッドロックが発生したことを示すエラーが発生する。

```bash
B> DELETE FROM employees WHERE emp_no = 500001;
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

デフォルト設定ではInnoDBは自動的にデッドロックを検知するための機能を有効にしており、デッドロックが検知された場合には、より小さな単位のトランザクションをロールバックさせるようにしている。

そのため自動的にセッションBで作成したトランザクションがロールバックされている。

参考資料

- [15.7.5.1 An InnoDB Deadlock Example](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlock-example.html)
- [15.7.5.2 Deadlock Detection](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlock-detection.html)
- [15.7.5.3 How to Minimize and Handle Deadlocks](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html)

## ISOLATION LEVELとは何か

トランザクションの **分離レベル (ISOLATION LEVEL)** とは、複数のトランザクションが同時にレコードの変更や読み込みを行う場合に、性能・信頼性・一貫性・再現性のバランスを調整するための設定である。

InnoDBは以下の4種類の分離レベルを実装しており、上から下にいくにつれてよりトランザクション間の分離を強化することで、性能は落ちるが一貫性や信頼性を向上させることができる。

- `READ UNCOMMITTED`
- `READ COMMITTED`
- `REPEATABLE READ`: InnoDBのデフォルト設定はコレ
- `SERIALIZABLE`

### READ UNCOMMITTED

### READ COMMITTED

### REPEATABLE READ




### SERIALIZABLE

参考資料

- [トランザクション分離レベルについてのまとめ](https://qiita.com/song_ss/items/38e514b05e9dabae3bdb)

## 行レベルロック、テーブルレベルロックの違いとは何か



## 悲観ロックと楽観ロックの違いは何か



参考資料

- [排他制御（楽観ロック・悲観ロック）の基礎](https://qiita.com/NagaokaKenichi/items/73040df85b7bd4e9ecfc)
- [Optimistic locking in MySQL](https://stackoverflow.com/questions/17431338/optimistic-locking-in-mysql)

## ACIDモデル

**ACIDモデル** とは、1つ以上のSQL文を含んでいる論理的な操作を示すトランザクションに信頼性を持たせるために定義された概念であり、Atomicity (原子性)、Consistency (一貫性)、Isolation (独立性)、Durability (永続性) に分解される。

参考資料

- [15.2 InnoDB and the ACID Model](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html)

### Atomicity (原子性)

- 1つのトランザクションの処理は、全てのタスクが実行されるか、1つも実行されないかのいずれかのみである
- トランザクションで10行の更新が開始され、5行が更新されたときにシステム障害が発生した場合、データベースではトランザクションがロールバックされる

### Consistency (一貫性)

- トランザクション内の処理により、データベースはある一貫した状態から、異なる一貫した状態に遷移する

### Isolation (独立性)

- トランザクション内で行われた変更は、トランザクションがコミットされるまで、他のトランザクションに影響を与えない

### Durability (永続性)

- トランザクションがコミットされると、行われた変更は永続的に確定される
- システム障害が発生したとしても、コミットされた状態は保持される

## Lock Types

### Shared and Exclusive Locks

InnoDBでは行レベルのロックとして **共有ロック (S)** と **占有ロック (X)** を実装している。

共有ロックは read lock とも呼ばれており、名前の通りテーブルからレコードをSELECT文で読み 取るときに使用するロックである。

![](../assets/share_lock.png)

占有ロックは write lock とも呼ばれており、名前の通りテーブルから読み取ったレコードに対して更新や削除を行うときに使用するロックである。

![](../assets/exclusive_lock.png)

とあるトランザクション T1 が行に対してロックを取得しているとき、ほかのトランザクション T2 が同じ行に対して取得できるロックは以下の組み合わせで表現できる。

|       |   S   |   X   |
| :---: | :---: | :---: |
|   S   |  Yes  |  No   |
|   X   |  No   |  No   |

つまりトランザクション T1 が共有ロックを取得している場合にのみ、ほかのトランザクション T2 は同じ行に対して共有ロックのみを取得することができる。

### Intention Locks

InnoDBでは、行ロックとテーブルロックの共存を可能にする、複数の粒度でのロックをサポートするために、 **インテンションロック** を採用している。

インテンションロックとは、 **テーブルレベルのロック** であり、トランザクションがテーブル内の行に対して、**後から必要になる**ロックのタイプ（共有ロックや占有ロック）を表している。

| lock type                     | description                                                                              | SQL                     |
| :---------------------------- | :--------------------------------------------------------------------------------------- | :---------------------- |
| インテンション共有ロック (IS) | トランザクションがテーブルの行に対して**共有ロック**を設定**するつもり**であることを示す | `SELECT ... FOR SHARE`  |
| インテンション占有ロック (IX) | トランザクションがテーブルの行に対して**共有ロック**を設定**するつもり**であることを示す | `SELECT ... FOR UPDATE` |

インテンションロックを取得する流れとしては、トランザクションが共有ロックを **行に** 対して **取得する前** に、トランザクションは **事前に** に **テーブル** に対してISロック、あるいはより強力なロックを取得しておく必要がある。

これは占有ロックの場合も同じであり、トランザクションが占有ロックを行に対して取得する前に、トランザクションは事前にテーブルに対してIXロックを取得しておく必要がある。

インテンションロックは、 `LOCK TABLES ... WRITE` のようにフルテーブルリクエストを除いてどのような操作もブロックしたりせず、あくまでもほかのユーザーに対して**これから取得するロックのタイプを示すだけ**である。

そのためインテンションロック同士 (IS/IX) では競合は発生しないため、排他制御は行ロックで行うことになる。 

実際に挙動を確認してみる。

```bash
# トランザクション内で `FOR SHARE` によるインテンション共有ロックを取得する
A> START TRANSACTION;
A> SELECT * FROM employees WHERE emp_no = 10001 FOR SHARE;
+--------+------------+---------------+-----------+--------+------------+
| emp_no | birth_date | first_name    | last_name | gender | hire_date  |
+--------+------------+---------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi Georgi | Facello   | M      | 1986-06-26 |
+--------+------------+---------------+-----------+--------+------------+

# ロックの状況を確認する
A> SELECT engine, object_schema, object_name, index_name, lock_type, lock_mode, lock_status, lock_data FROM performance_schema.data_locks;
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode     | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IS            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S,REC_NOT_GAP | GRANTED     | 10001     |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
```

上記でインテンション共有ロックを実行した後でロックの状況を確認してみると、確かにテーブルロックとしてインテンション共有ロックが取得されており、またそのあとにレコードロックによる共有ロックが取得されていることがわかる。

ではインテンションロックは他のトランザクションからのインテンションロックで排他制御されないことを確認するために、異なるトランザクションから占有ロックの取得を実行する。

```bash
# 下記のクエリを実行すると、トランザクションAの共有ロックの解除待ち状態となる
B> START TRANSACTION;
B> SELECT * FROM employees WHERE emp_no = 10001 FOR UPDATE; 

```

すると処理は実行されずにトランザクションAが取得している共有ロックが解除されるのを待機している状態となる。

ではこの状態で、以下のようにロックの状態を確認すると確かにインテンションロックは待機状態になっていないことがわかる。（インテンション占有ロックは `GRANTED` となっており、占有ロックは `WAITING` となっている。）

```bash
A> SELECT engine, object_schema, object_name, index_name, lock_type, lock_mode, lock_status, lock_data FROM performance_schema.data_locks;
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode     | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IX            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X,REC_NOT_GAP | WAITING     | 10001     |
| INNODB | employees     | employees   | NULL       | TABLE     | IS            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S,REC_NOT_GAP | GRANTED     | 10001     |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
```

しばらく待機すればトランザクションBの待機処理がタイムアウトしてしまう。

```bash
# 待機処理のタイムアウトが発生する。
B> SELECT * FROM employees WHERE emp_no = 10001 FOR UPDATE; 
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 占有ロックの待機処理が消えていることがわかる
A> SELECT engine, object_schema, object_name, index_name, lock_type, lock_mode, lock_status, lock_data FROM performance_schema.data_locks;
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode     | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IX            | GRANTED     | NULL      |
| INNODB | employees     | employees   | NULL       | TABLE     | IS            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S,REC_NOT_GAP | GRANTED     | 10001     |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
```

ロックの状態を確認しても、インテンション占有ロックは残っているが、占有ロックは削除されていることがわかる。

### Record Locks

**レコードロック** とは、インデックスレコードに対するロックであり、`SELECT * FROM employees WHERE emmp_no = 10001 FOR UPDATE` などの文を発行した際に取得し、他のトランザクションが `employees.emp_no` が `10001` である行の挿入や更新、削除を禁止することができる。

InnoDBでは、テーブルにインデックスが存在しない場合でも、クラスタインデックスを背後で作成し、このインデックスに対してロックを取得するらしい。つまりレコードロックは **常に** インデックスをロックする。

試しに主キーではない値を指定した場合に取得されるロックを確認する。

```bash
mysql> SELECT * FROM employees WHERE first_name = 'Georgi' FOR UPDATE;
mysql> SELECT engine, object_schema, object_name, index_name, lock_type, lock_mode, lock_status, lock_data FROM performance_schema.data_locks;
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode | lock_status | lock_data              |
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+
| INNODB | employees     | employees   | NULL       | TABLE     | IX        | GRANTED     | NULL                   |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | supremum pseudo-record |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 10002                  |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 10003                  |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 10004                  |
...
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 499998                 |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 499999                 |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X         | GRANTED     | 500000                 |
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+
```

> なぜか全レコードに対してレコードロックが取得された。
> 理由は何か

参考資料

- [知って得するInnoDBセカンダリインデックス活用術！](https://nippondanji.blogspot.com/2010/10/innodb.html)

### Gap Locks

**ギャップロック** とは、インデックスレコードのある **範囲に対して** 取得したり、最初のインデックスレコードの **1つ前** や最後のインデックスレコードの **1つ後** に対して取得するロックである。

![](../assets/gap_lock.png)

例えばあるトランザクションが以下のクエリを発行した際に、他のトランザクションが `employees.emp_no` が `10005` のように範囲内に存在している値に対して、レコードが実際に存在しているかどうかにかかわらず、レコードを挿入・更新することを禁止する。

```sql
SELECT * FROM employees WHERE emp_no BETWEEN 10001 AND 10010 FOR UPDATE;
```

実際に上記のクエリを実行した際に取得されるロックを確認すると、以下のように範囲指定した全レコードに対して占有ロックが取得されていることがわかる。

```bash
mysql> SELECT engine, object_schema, object_name, index_name, lock_type, lock_mode, lock_status, lock_data FROM performance_schema.data_locks;
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode     | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IX            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X,REC_NOT_GAP | GRANTED     | 10001     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10002     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10003     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10004     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10005     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10006     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10007     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10008     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10009     |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X             | GRANTED     | 10010     |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
```

上記の結果からわかるように、 `employees.emp_no` に対して占有ロックを取得しているため、10001 から 10010 までの範囲に対して、レコードを挿入することもできず、共有ロックも占有ロックも取得することもできない点である。

ギャップロックの特徴は、処理の性能と並行実効性のトレードオフであり、トランザクションの **分離レベル** に応じて使用されるかどうかが決定する。例えば分離レベルを `READ COMMITTED` に変更した場合には、ギャップロックが無効になる。

ギャップロックは複数行にまたがるロックを取得する際に使用されるため、もしも主キーなどの一意に定まる検索条件を使用するクエリでは、ギャップロックは使用されずに先述したレコードロックが取得される。

試しに以下のようにとびとびの主キーのレコードを挿入しておく。

```sql
INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date)
VALUES
    (500000, '1990-01-01', 'A', 'T', 'M', '1991-01-01'),
    (500001, '1990-01-01', 'B', 'U', 'M', '1991-01-01'),
    (500002, '1990-01-01', 'C', 'V', 'M', '1991-01-01'),
    (500005, '1990-01-01', 'D', 'W', 'M', '1991-01-01'),
    (500008, '1990-01-01', 'E', 'X', 'M', '1991-01-01'),
    (500009, '1990-01-01', 'F', 'Y', 'M', '1991-01-01'),
    (500010, '1990-01-01', 'G', 'Z', 'M', '1991-01-01');
```

次に以下のように範囲指定でレコードに対してロックをかけてみる。

```sql
SELECT * FROM employees WHERE emp_no BETWEEN 500000 and 500005 FOR SHARE;
```

この場合には以下のようなロックがかかっている。

```bash
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode     | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IS            | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S,REC_NOT_GAP | GRANTED     | 500000    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S             | GRANTED     | 500005    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S             | GRANTED     | 500002    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S             | GRANTED     | 500001    |
+--------+---------------+-------------+------------+-----------+---------------+-------------+-----------+
```

では他のトランザクションからとびとびとなっている主キーの間にレコードを挿入しようとしてみる。

```bash
# 処理は実行されずに待機状態となる
B> INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date)
   VALUES 
       (500004, '1990-01-01', 'A', 'T', 'M', '1991-01-01');

# ロックの状態を確認すると占有ロックが待機状態となっていることがわかる。
+--------+---------------+-------------+------------+-----------+------------------------+-------------+-----------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode              | lock_status | lock_data |
+--------+---------------+-------------+------------+-----------+------------------------+-------------+-----------+
| INNODB | employees     | employees   | NULL       | TABLE     | IX                     | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | X,GAP,INSERT_INTENTION | WAITING     | 500005    |
| INNODB | employees     | employees   | NULL       | TABLE     | IS                     | GRANTED     | NULL      |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S,REC_NOT_GAP          | GRANTED     | 500000    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S                      | GRANTED     | 500005    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S                      | GRANTED     | 500002    |
| INNODB | employees     | employees   | PRIMARY    | RECORD    | S                      | GRANTED     | 500001    |
+--------+---------------+-------------+------------+-----------+------------------------+-------------+-----------+
```

参考資料

- [MySQLのInnoDBのロック挙動調査](https://github.com/ichirin2501/doc/blob/master/innodb.md#%E8%A1%8C%E3%83%AD%E3%83%83%E3%82%AF%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)
- [良く分かるMySQL Innodbのギャップロック](https://qiita.com/kenjiszk/items/05f7f6e695b93570a9e1)
- [MySQL InnoDBのinsertとlockの話](http://tech.voyagegroup.com/archives/8085782.html)
- [ LT：MySQLのギャップロックとネクストキーロックについて](https://speakerdeck.com/yoshiakiyamasaki/lt-mysqlfalsegiyatupurotukutonekusutokirotukunituite)

### Next-Key Locks

**ネクストキーロック** とは、レコードロックと対象レコードの直前までのギャップロックの組み合わせで構成されている。

例えば以下のインデックスレコードに対しては、5通りのネクストキーロックが発生する可能性が存在している。

![](../assets/next_key_lock.png)

最後の区間 `( 20, + INF )` は、インデックス内に存在している20よりも大きな値のインデックスレコードを示している。

InnoDBがデフォルトで有効している分離レベル `REPEATABLE READ` では、ネクストキーロックは有効化されている。

### Insert Intention Locks

**挿入インテンションロック** とは、レコードが挿入される前に `INSERT`
 によって設定されるギャップロックの一種である。

これは例えば `employees` テーブルのインデックスレコードに `500002` と `500005` が存在しており、その間にインデックスレコードが存在していない場合を考える。

ここで、異なるトランザクション同士が `500003` と `500004` にレコードを挿入する前に、それぞれのトランザクションがギャップロックを `500002 ~ 500005` で取得するが、レコードが競合していないため、お互いにブロックされることはない。

例えば以下のテーブルが存在していたとする。

```sql
CREATE TABLE child (
  id INT(11) NOT NULL PRIMARY KEY
) ENGINE=InnoDB;

INSERT INTO child (id)
VALUES (90, 102);
```

ここで異なるトランザクションが行を挿入する前に、挿入インテンションロックをギャップロック内のレコードに対して取得する。

```bash
A> START TRANSACTION;
A> SELECT * FROM child WHERE id > 100 FOR UPDATE;
+-----+
| id  |
+-----+
| 102 |
+-----+

# この時に以下のロックが取得されている。
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode | lock_status | lock_data              |
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+
| INNODB | employees     | child       | NULL       | TABLE     | IX        | GRANTED     | NULL                   |
| INNODB | employees     | child       | PRIMARY    | RECORD    | X         | GRANTED     | supremum pseudo-record |
| INNODB | employees     | child       | PRIMARY    | RECORD    | X         | GRANTED     | 102                    |
+--------+---------------+-------------+------------+-----------+-----------+-------------+------------------------+

# 異なるトランザクションBからギャップロックが取得されているインデックスに対してレコードを挿入することを考える
B> START TRANSACTION;
B> INSERT INTO child (id) VALUES (101);

# この場合には以下のようにギャップロックがかかっているレコードに対して挿入インテンションロックは待機状態となっていることがわかる
+--------+---------------+-------------+------------+-----------+------------------------+-------------+------------------------+
| engine | object_schema | object_name | index_name | lock_type | lock_mode              | lock_status | lock_data              |
+--------+---------------+-------------+------------+-----------+------------------------+-------------+------------------------+
| INNODB | employees     | child       | NULL       | TABLE     | IX                     | GRANTED     | NULL                   |
| INNODB | employees     | child       | PRIMARY    | RECORD    | X,GAP,INSERT_INTENTION | WAITING     | 102                    |
| INNODB | employees     | child       | NULL       | TABLE     | IX                     | GRANTED     | NULL                   |
| INNODB | employees     | child       | PRIMARY    | RECORD    | X                      | GRANTED     | supremum pseudo-record |
| INNODB | employees     | child       | PRIMARY    | RECORD    | X                      | GRANTED     | 102                    |
+--------+---------------+-------------+------------+-----------+------------------------+-------------+------------------------+
```

参考資料

- [MySQL - InnoDBのロック関連まとめ](https://qiita.com/mizzwithliam/items/31fb68217899bd0559e8)
