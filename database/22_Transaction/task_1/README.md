# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#課題1)
  - [デッドロックとは何か](#デッドロックとは何か)
  - [ISOLATION LEVELとは何か](#isolation-levelとは何か)
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



参考資料

- [トランザクション分離レベルについてのまとめ](https://qiita.com/song_ss/items/38e514b05e9dabae3bdb)

## 行レベルロック、テーブルレベルロックの違いとは何か

## 悲観ロックと楽観ロックの違いは何か



参考資料

- [排他制御（楽観ロック・悲観ロック）の基礎](https://qiita.com/NagaokaKenichi/items/73040df85b7bd4e9ecfc)
- [Optimistic locking in MySQL](https://stackoverflow.com/questions/17431338/optimistic-locking-in-mysql)

## ACIDモデル

**ACIDモデル** とは、ビジネスデータやアプリケーションにとって重要となる **信頼性** の側面を重視したデータベースの設計原則である。

連続する複数の操作が

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

占有ロックは write lock とも呼ばれており、名前の通りテーブルから読み取ったレコードに対して更新や削除を行うときに使用するロックである。

とあるトランザクション T1 が行に対してロックを取得しているとき、ほかのトランザクション T2 が同じ行に対して取得できるロックは以下の組み合わせで表現できる。

|       |   S   |   X   |
| :---: | :---: | :---: |
|   S   |  Yes  |  No   |
|   X   |  No   |  No   |

つまりトランザクション T1 が共有ロックを取得している場合にのみ、ほかのトランザクション T2 は同じ行に対して共有ロックのみを取得することができる。

### Intention Locks

InnoDBでは、行ロックとテーブルロックの共存を可能にする、複数の粒度でのロックをサポートするために、 **インテンションロック** を採用している。

インテンションロックとは、テーブルレベルのロックであり、トランザクションがテーブル内の行に対して、**後から必要になる**ロックのタイプ（共有ロックや占有ロック）を表している。

| lock type                     | description                                                                              | SQL                     |
| :---------------------------- | :--------------------------------------------------------------------------------------- | :---------------------- |
| インテンション共有ロック (IS) | トランザクションがテーブルの行に対して**共有ロック**を設定**するつもり**であることを示す | `SELECT ... FOR SHARE`  |
| インテンション占有ロック (IX) | トランザクションがテーブルの行に対して**共有ロック**を設定**するつもり**であることを示す | `SELECT ... FOR UPDATE` |

インテンションロックを取得する流れとしては、トランザクションが共有ロックを行に対して**取得する前**に、トランザクションは**事前に**にテーブルに対してISロック、あるいはより強力なロックを取得しておく必要がある。

これは占有ロックの場合も同じであり、トランザクションが占有ロックを行に対して取得する前に、トランザクションは事前にテーブルに対してIXロックを取得しておく必要がある。

インテンションロックは、 `LOCK TABLES ... WRITE` のようにフルテーブルリクエストを除いてどのような操作もブロックしたりせず、あくまでもほかのユーザーに対して**これから取得するロックのタイプを示すだけ**である。

### Record Locks

**レコードロック** とは、インデックスレコードに対するロックであり、`SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE`などの文を発行した際に取得し、他のトランザクションが `t.c1` が `10` である行の挿入や更新、削除を禁止することができる。

InnoDBでは、テーブルにインデックスが存在しない場合でも、クラスタインデックスを背後で作成し、このインデックスに対してロックを取得するらしい。

### Gap Locks

**ギャップロック** とは、インデックスレコードのある**範囲に対して**取得したり、最初のインデックスレコードの1つ前や最後のインデックスレコードの1つ後に対して取得するロックである。

例えばあるトランザクションが以下のクエリを発行した際に、他のトランザクションが `t.c1` が `15` のように範囲内に存在している値に対してレコードを挿入・更新することを禁止する。

```sql
SELECT c1 FROM t WHERE c1 BETWEEN 10 AND 20 FOR UPDATE
```

注意点としては `t.c1` が10から20までの範囲に対して、レコードを挿入することもできず、SロックもXロックも取得することもできない点である。

ギャップロックの特徴は、処理の性能と平衡実効性のトレードオフであり、トランザクションの**分離レベル**によって使用されるかどうかが決定する。

ギャップロックは複数行にまたがるロックを取得する際に使用されるため、もしも主キーなどの一意に定まる検索条件を使用するクエリでは、ギャップロッ
クは使用されずに先述したレコードロックが取得される。

参考資料

- [良く分かるMySQL Innodbのギャップロック](https://qiita.com/kenjiszk/items/05f7f6e695b93570a9e1)

### Next-Key Locks



