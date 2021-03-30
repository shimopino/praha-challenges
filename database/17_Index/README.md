# 課題17「インデックスを理解する」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

<<<<<<< HEAD
- [課題17「インデックスを理解する」](#課題17インデックスを理解する)
  - [課題1](#課題1)
    - [インデックスとは何か](#インデックスとは何か)
    - [「Slow Query Log」とは何か](#slow-query-logとは何か)
    - [カーディナリティとは何か](#カーディナリティとは何か)
    - [カバリングインデックスとは何か](#カバリングインデックスとは何か)
  - [課題2](#課題2)
    - [MySQL Docker Imageの使い方](#mysql-docker-imageの使い方)
    - [performance_schema の使い方](#performance_schema-の使い方)
      - [Step1](#step1)
      - [Step2](#step2)
      - [Step3](#step3)
      - [Step4](#step4)
      - [Step5](#step5)
      - [Step6](#step6)
    - [EXPLAIN の使い方](#explain-の使い方)
    - [SELECTクエリ その1](#selectクエリ-その1)
      - [インデックスなし](#インデックスなし)
      - [インデックスあり](#インデックスあり)
    - [SELECTクエリ その2](#selectクエリ-その2)
      - [インデックスなし](#インデックスなし-1)
      - [インデックスあり](#インデックスあり-1)
    - [SELECTクエリ その3](#selectクエリ-その3)
      - [インデックスなし](#インデックスなし-2)
      - [インデックスあり](#インデックスあり-2)
  - [課題3](#課題3)
  - [課題4](#課題4)
=======
- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [インデックスとは何か](#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [「Slow Query Log」とは何か](#slow-query-log%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [カーディナリティとは何か](#%E3%82%AB%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8A%E3%83%AA%E3%83%86%E3%82%A3%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [カバリングインデックスとは何か](#%E3%82%AB%E3%83%90%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [MySQL Docker Imageの使い方](#mysql-docker-image%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
  - [performance_schema の使い方](#performance_schema-%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
    - [Step1](#step1)
    - [Step2](#step2)
    - [Step3](#step3)
    - [Step4](#step4)
    - [Step5](#step5)
    - [Step6](#step6)
  - [EXPLAIN の使い方](#explain-%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
  - [SELECTクエリ その1](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE1)
  - [SELECTクエリ その2](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE2)
  - [SELECTクエリ その3](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE3)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
- [課題4](#%E8%AA%B2%E9%A1%8C4)
>>>>>>> b371c686a1260ccf04fa04a20094150bd420d95a

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

### インデックスとは何か

インデックスとは、メモリ上のテーブルデータとは独立して存在し、テーブルに対して論理的な順序付けを行った上でアクセスすることで、データへの検索などを高速化するために使用される。

インデックスの導入によるSQLクエリのパフォーマンス改善が非常に導入しやすく、その理由は以下の2点である。

- データベースにインデックスを作成するだけなので、アプリケーションのコードに影響を与えない
- インデックスは実際のテーブルとは異なる領域に作成されるため、テーブルのデータに影響を与えない

これは [B+-tree](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html) で実際のインデックスの挙動を確認することができる。

![](./b-tree.png)

上図からわかるインデックスでは、木構造の末端部分（**リーフノード**）に実際のテーブルレコードへのポインタが格納されている。

また特徴的な点としては、適当に数値を設定してデータを挿入・削除してみると、インデックスの構造が再構築され、常に木構造の深さを一定に保つようになっており、データ量が増加したとしてもインデックスが劣化しないような設計になっている。

また各インデックスの値がすでに並び替えた状態で木構造が構築されるため、1レコードを検索するだけではなく、`BETWEEN` 句を使用した範囲指定などでもインデックスを有効活用することができる。

参考資料

- [8.3 Optimization and Indexes](https://dev.mysql.com/doc/refman/5.7/en/optimization-indexes.html)

### 「Slow Query Log」とは何か

**スロークエリログ (Slow query log)** とは、SQLの実行時間が指定した時間よりも長い場合にそのログを出力することで、パフォーマンスに影響を与えるSQLを発見する際に役立つログである。

今回の演習で使用しているMySQLのバージョン5.7.4では、デフォルトではスロークエリログは出力せず、スロークエリの時間条件は10秒になっている。

```bash
# スロークエリの出力設定は OFF である
mysql> show variables like 'slow%';
+---------------------+--------------------------------------+
| Variable_name       | Value                                |
+---------------------+--------------------------------------+
| slow_launch_time    | 2                                    |
| slow_query_log      | OFF                                  |
| slow_query_log_file | /var/lib/mysql/36cf2f84e306-slow.log |
+---------------------+--------------------------------------+

# スロークエリの条件は10秒である
mysql> show variables like 'long%';
+-----------------+-----------+
| Variable_name   | Value     |
+-----------------+-----------+
| long_query_time | 10.000000 |
+-----------------+-----------+
```

> 「ちゃんとslow query logを調べた？」と聞かれました。なぜ調べる必要があるのでしょうか？

SELECT文で使用している全ての列に対してインデックスを作成したとしても、そのインデックスが適切に使用されるかどうかは実際に実行されないとわからない。

例えばSELECT文を発行した際に、インデックスを使用せずに **テーブルフルスキャン** が実行されていることもある。そのためスロークエリログを出力して、意図せずSQLの実行速度が低下してしまわないか確認しておく必要がある。

なお設定を変更したい場合には、`my.cnf` を以下のように設定して再起動すればいい。

```bahs
[mysqld]
slow_query_log=ON
long_query_time = 5
slow_query_log_file = /tmp/mysql-slow.sql
```

参考資料

- [[MySQL] 5.4.5 The Slow Query Log](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html)

### カーディナリティとは何か

インデック`スを作成する列を決定する際に重要な情報が **カーディナリティ** であり、対象の列に存在するデータがどの程度の **種類の多さ** を有しているのかをあらわしている。

例えば今回の演習で使用する `employees` テーブルには、`gender` という性別を意味する列が存在しているが、この列には `M` と `F` の2つの種類のデータが存在しており、この場合はカーディナリティが **2** であることを意味する。

そのほかにも `first_name` という列のカーディナリティを調べてみると、300024件存在しているレコードの中で、1275種類のデータが存在していることがわかる。

インデックスを作成する場合には、 **カーディナリティが高い** 列を選ぶほうがいい。

これはカーディナリティが低い（例えば「`gender`」など）列を選択してしまうと、1つの検索条件に該当するレコードが多数存在してしまうことになり（`gender` が `M` の場合は179973県該当してしまう）、インデックスを大量に捜査する必要が出てきてしまい、インデックスの導入によるパフォーマンスの向上が見込めないためである。

またカーディナリティが高い場合であっても、一部の種類にデータが集中してしまっているような状況では、インデックスの効果は得られない。この場合でも先ほどと同様に、特定の検索条件に該当するレコードが大量に存在してしまうと、結局大量のインデックスの捜査が必要になってしまうからである。

参考資料

- [[MySQL] Glossary](https://dev.mysql.com/doc/refman/5.7/en/glossary.html)
  - cardinality

### カバリングインデックスとは何か

- [[Use the Index Luke] Covering Index](https://use-the-index-luke.com/ja/sql/clustering/index-only-scan-covering-index)

## 課題2

### MySQL Docker Imageの使い方

練習用に [https://hub.docker.com/r/genschsa/mysql-employees](https://hub.docker.com/r/genschsa/mysql-employees) を使用する。

まずはDockerコンテナを起動する。

```bash
# Volumeはルートディレクトリ直下に変更
docker run -d \
  --rm \
  --name mysql-employees \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=college \
  -v /data:/var/lib/mysql \
  genschsa/mysql-employees
```

あとはコンテナ内にアクセスして以下のコマンドを実行すれば、MySQLにアクセスすることが可能となる。

```bash
> mysql -u root -pcollege
```

なお使用しているMySQLのバージョンは以下のように `5.7.24` になっている。

```bash
> mysql -V
>>
mysql  Ver 14.14 Distrib 5.7.24, for Linux (x86_64) using  EditLine wrapper
```

初期状態では以下のデータベースが作成されている。

```bash
mysql> SHOW DATABASES;
>>
+--------------------+
| Database           |
+--------------------+
| information_schema |
| employees          |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

演習で使用する `employees` データベースには、以下のテーブルが初期状態で作成されている。

```bash
mysql> USE employees;
>>
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed


mysql> show tables;
>>
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| salaries             |
| titles               |
| v_full_departments   |
| v_full_employees     |
+----------------------+
```

演習で使用する `employees` テーブルの定義は以下のようになっている。

```bash
mysql> desc employees
>>
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int(11)       | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   |     | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   |     | NULL    |       |
+------------+---------------+------+-----+---------+-------+
```

### performance_schema の使い方

まずは `performance_schema` が初期化されているのか確認する。

```bash
mysql> SHOW VARIABLES LIKE 'performance_schema';
>>
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| performance_schema | ON    |
+--------------------+-------+
```

では次に対象のスキーマがストレージエンジンとして使用できるかどうかを確認する。

```bash
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE='PERFORMANCE_SCHEMA'\G
>>
*************************** 1. row ***************************
      ENGINE: PERFORMANCE_SCHEMA
     SUPPORT: YES
     COMMENT: Performance Schema
TRANSACTIONS: NO
          XA: NO
  SAVEPOINTS: NO
```

以下では具体的な計測方法をまとめていく

#### Step1

まずは収集するイベントを、クエリを実行しているユーザーにのみに限定する。

以下を見るとわかるようにデフォルト設定では、`setup_actors` にて全てのフォアグラウンドスレッドの監視とイベントの収集ができるようになっている。

なお以下の結果のうち、`%` は全てのHostやUser、全ての権限などを意味している。（参考資料は[コチラ](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-setup-actors-table.html)）

```bash
mysql> SELECT * FROM performance_schema.setup_actors;
>>
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

この状態からユーザーが実行したクエリに対してのみ、監視とイベントの収集を行うように変更する必要がある。

そこでまずはMySQLにアクセスしているユーザー名とホスト名（`<user>@<host>`）を確認する。（参考資料は[コチラ](https://dev.mysql.com/doc/refman/5.7/en/information-functions.html#function_current-user)）

```bash
mysql> select CURRENT_USER();
>>
+----------------+
| CURRENT_USER() |
+----------------+
| root@localhost |
+----------------+
```

あとは、以下のようにユーザー名を指定したうえで監視とイベントの収集を有効化しておく。

```bash
# 全てのフォアグラウンドスレッドに対する処理を無効化
mysql> UPDATE performance_schema.setup_actors
       SET ENABLED = 'NO', HISTORY = 'NO'
       WHERE HOST = '%' AND USER = '%';

# クエリを実行するユーザーに対してのみ監視とイベントの収集を有効化
mysql> INSERT INTO performance_schema.setup_actors
       (HOST, USER, ROLE, ENABLED, HISTORY)
       VALUES('localhost','root','%','YES','YES');
```

これで以下のように監視とイベントの収集を行う設定を変更することができている。

```bash
mysql> SELECT * FROM performance_schema.setup_actors;
>>
+-----------+------+------+---------+---------+
| HOST      | USER | ROLE | ENABLED | HISTORY |
+-----------+------+------+---------+---------+
| %         | %    | %    | NO      | NO      |
| localhost | root | %    | YES     | YES     |
+-----------+------+------+---------+---------+
```

#### Step2

次に `setup_instruments` テーブルの設定を変更する。

このテーブルは、MySQLサーバのソースコード内で処理時間や待機時間を収集するための設定を管理している。

```bash
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES'
       WHERE NAME LIKE '%statement/%';

mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES'
       WHERE NAME LIKE '%stage/%';
```

これでSQLを実行した際にどのようなコマンドに対して計測を行うのか設定することができる。

#### Step3

次に `setup_consumers` テーブルの設定を変更する。

このテーブルには監視やイベントの収集を実施する際に、履歴を含んだり、実行したクエリに対してのみだったりと、どの程度の情報を取得するのか設定することができる。

今の環境でのデフォルト値は以下のようになっている。

```bash
mysql> select * from performance_schema.setup_consumers WHERE NAME LIKE '%events_statements_%';
+--------------------------------+---------+
| NAME                           | ENABLED |
+--------------------------------+---------+
| events_statements_current      | YES     |
| events_statements_history      | YES     |
| events_statements_history_long | NO      |
+--------------------------------+---------+

mysql> select * from performance_schema.setup_consumers WHERE NAME LIKE '%events_stages_%';
+----------------------------+---------+
| NAME                       | ENABLED |
+----------------------------+---------+
| events_stages_current      | NO      |
| events_stages_history      | NO      |
| events_stages_history_long | NO      |
+----------------------------+---------+
```

以上の設定を有効化しておく。

```bash
mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES'
       WHERE NAME LIKE '%events_statements_%';

mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES'
       WHERE NAME LIKE '%events_stages_%';
```

#### Step4

ここまででユーザーが実行したクエリに対する計測は可能になっているため、後は実際にクエリを発行すればいい。

```bash
mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
>>
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

#### Step5

次に実行したクエリに紐づいているイベントIDを取得するため、[`events_statements_history_long`](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-events-statements-history-long-table.html) から該当するSQLクエリのレコードを取得する。

```bash
+----------+----------+--------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                               |
+----------+----------+--------------------------------------------------------+
|       32 | 0.000222 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
+----------+----------+--------------------------------------------------------+
```

#### Step6

最後に [`events_stages_history_long`](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-events-stages-history-long-table.html) から取得したイベントIDに該当するログを確認する。

```bash
mysql> SELECT event_name AS Stage, TRUNCATE(TIMER_WAIT/1000000000000,6) AS Duration
       FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=32;
>>
+--------------------------------+----------+
| Stage                          | Duration |
+--------------------------------+----------+
| stage/sql/starting             | 0.000052 |
| stage/sql/checking permissions | 0.000002 |
| stage/sql/Opening tables       | 0.000046 |
| stage/sql/init                 | 0.000013 |
| stage/sql/System lock          | 0.000002 |
| stage/sql/optimizing           | 0.000004 |
| stage/sql/statistics           | 0.000061 |
| stage/sql/preparing            | 0.000003 |
| stage/sql/executing            | 0.000000 |
| stage/sql/Sending data         | 0.000006 |
| stage/sql/end                  | 0.000000 |
| stage/sql/query end            | 0.000002 |
| stage/sql/closing tables       | 0.000002 |
| stage/sql/freeing items        | 0.000021 |
| stage/sql/cleaning up          | 0.000000 |
+--------------------------------+----------+
```

参考資料

- MySQL 5.7 Reference Manual
  - [Chapter 25 MySQL Performance Schema](https://dev.mysql.com/doc/refman/5.7/en/performance-schema.html)
  - [25.19.1 Query Profiling Using Performance Schema](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-query-profiling.html)
- [MySQL 5.7入門（チューニング基礎編）](https://downloads.mysql.com/presentations/20151208_02_MySQL_Tuning_for_Beginners.pdf)
- [[Gihyo.jp] MySQLをチューニング，そしてスケールアップ／スケールアウトへ](https://gihyo.jp/dev/serial/01/MySQL-tuning-scale)
- [[Gihyo.jp] MySQL道普請便り](https://gihyo.jp/dev/serial/01/mysql-road-construction-news)
- [[Gihyo.jp] ゲームを題材に学ぶ 内部構造から理解するMySQL](https://gihyo.jp/dev/serial/01/game_mysql)
- [[Think It] MySQLマイスターに学べ！ 即効クエリチューニング 記事一覧](https://thinkit.co.jp/series/5588)

### EXPLAIN の使い方

先ほど時間計測したSQLクエリに対して、実行計画を確認するために `EXPLAIN` を付けて再実行する。

```bash
mysql> EXPLAIN SELECT * FROM employees.employees WHERE emp_no = 10001;
>>
--------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
```

インデックスの効果を検証するために確認すべき項目は **type** であり、これはテーブルのデータに対してどのようにアクセスしたのかを示している。



参考資料

- MySQL 5.7 Reference Manual
  - [8.8 Understanding the Query Execution Plan](https://dev.mysql.com/doc/refman/5.7/en/execution-plan-information.html)
- [[USE THE INDEX LUKE] 実行計画 -MySQL-](https://use-the-index-luke.com/ja/sql/explain-plan/mysql)

### SELECTクエリ その1

#### インデックスなし

#### インデックスあり

### SELECTクエリ その2

#### インデックスなし

#### インデックスあり

### SELECTクエリ その3

#### インデックスなし

#### インデックスあり

## 課題3

## 課題4
