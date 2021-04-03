# 課題17「インデックスを理解する」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [インデックスとは何か](#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [「Slow Query Log」とは何か](#slow-query-log%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [カーディナリティとは何か](#%E3%82%AB%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8A%E3%83%AA%E3%83%86%E3%82%A3%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
  - [カバリングインデックスとは何か](#%E3%82%AB%E3%83%90%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [performance_schema の使い方](#performance_schema-%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
    - [Step1](#step1)
    - [Step2](#step2)
    - [Step3](#step3)
    - [Step4](#step4)
    - [Step5](#step5)
    - [Step6](#step6)
  - [EXPLAIN の使い方](#explain-%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
  - [SELECTクエリ その1](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE1)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C)
  - [SELECTクエリ その2](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE2)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-1)
  - [SELECTクエリ その3](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE3)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-2)
  - [SELECTクエリ その4](#select%E3%82%AF%E3%82%A8%E3%83%AA-%E3%81%9D%E3%81%AE4)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-3)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
  - [INSERT その1](#insert-%E3%81%9D%E3%81%AE1)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-4)
  - [INSERT その2](#insert-%E3%81%9D%E3%81%AE2)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-5)
  - [DELETE その1](#delete-%E3%81%9D%E3%81%AE1)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-6)
  - [DELETE その2](#delete-%E3%81%9D%E3%81%AE2)
    - [比較結果](#%E6%AF%94%E8%BC%83%E7%B5%90%E6%9E%9C-7)
  - [補足情報](#%E8%A3%9C%E8%B6%B3%E6%83%85%E5%A0%B1)

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
- [[Qiita] MySQLでインデックスを貼る時に読みたいページまとめ(初心者向け）](https://qiita.com/C058/items/1c9c57f634ebf54d99bb)
- [[MySQL Tutorial] MySQL Index](https://www.mysqltutorial.org/mysql-index/)

---

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

---

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

---

### カバリングインデックスとは何か

**カバリングインデックス（Covering Index）** とは、SELECT句を使用して特定の列を抽出する際に、インデックスが作成されている列のみを指定することで、実際のテーブルにアクセスすることなく、インデックスに保存されているデータを抽出することでSQLの実行速度を向上させる方法である。

例えば以下の `employees` テーブルに対して、インデックスが主キー以外にも、`first_name` と `last_name` と `hire_date` にインデックスが作成されているとする。

```bash
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

このときに以下のSQLクエリを発行した場合、テーブルにアクセスすることなくインデックスからしかデータを抽出しないため、実行速度は高速である。

```sql
SELECT first_name, last_name
FROM employees
WHERE hire_date = '1985-06-20';
```

![](covering-index.png)

カバリングインデックスを使用する際の注意点としては、インデックス自体のサイズが肥大化してしまう点や、データ量が少ない場合には高速化が見込めない点である。

参考資料

- [[Use the Index Luke] Covering Index](https://use-the-index-luke.com/ja/sql/clustering/index-only-scan-covering-index)
- [[Stackoverflow] What is a Covered Index?](https://stackoverflow.com/questions/62137/what-is-a-covered-index)
- [【MySQL】Covering Index で処理が高速化するのを確認する](https://www.softel.co.jp/blogs/tech/archives/5139)

---

## 課題2

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

---

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

---

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

---

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

---

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

---

#### Step5

次に実行したクエリに紐づいているイベントIDを取得するため、[`events_statements_history_long`](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-events-statements-history-long-table.html) から該当するSQLクエリのレコードを取得する。

```sql
-- TIMER_WAITはピコ秒 (10の-12乗) なので通常の秒単位で表示する
mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
       FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
>>
+----------+----------+--------------------------------------------------------+
| EVENT_ID | Duration | SQL_TEXT                                               |
+----------+----------+--------------------------------------------------------+
|       32 | 0.000222 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
+----------+----------+--------------------------------------------------------+
```

---

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

表示されている内容をまとめる。

| スレッドのState値    | 説明                                                                                                                                                                              | 
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| starting             | クエリの実行開始時に要する時間                                                                                                                                                    | 
| checking permissions | サーバに対してクエリを実行できる権限を有しているのかスレッドが確認する時間                                                                                                        | 
| Opening Tables       | スレッドがテーブルを開くまでの時間<br><br>ALTER TABLE や LOCK TABLE などのクエリが実行された場合は、実行が終了するまでテーブルを開くことはできない                                | 
| init                 | ALTER TABLE や SELECT、DELETE、INSERT、UPDATEの初期化前に実行される<br><br>バイナリログやInnoDBログのフラッシュ、クエリキャッシュのクリーンアップ処理などが含まれる               | 
| System lock          | スレッドがテーブルに対してロックを要求している時間                                                                                                                                | 
| optimizing           | クエリに対して最初に実行される最適化処理                                                                                                                                          | 
| statistics           | クエリの実行計画を構築するための統計情報を計算する時間                                                                                                                            | 
| preparing            | クエリを最適化している際に発生する時間                                                                                                                                            | 
| executing            | クエリを実行し始める時間                                                                                                                                                          | 
| Sending data         | SELECT文で要求されたデータへの読み込みと加工を実行してクライアントにデータを送信する時間<br><br>大量のディスクI/Oを必要とするため、たいていはこの状態が最も時間がかかることが多い | 
| end                  | クエリの処理が実行し終わり、クリーンアップ処理を実行する前までの時間<br><br>クエリキャッシュの削除、バイナリログへのイベントの書き込み、メモリバッファの解放などが実行される      | 
| query end            | クエリの処理が終了し、freeing itemsが実行される前までの時間                                                                                                                       | 
| closing tables       | 変更されたテーブルデータをディスクにフラッシュし、使用したテーブルを閉じる時間<br><br>ここに時間がかかる場合はディスク容量が一杯になってしまっている可能性がある                  | 
| freeing items        | クエリキャッシュなどの、アイテムを解放する                                                                                                                                        | 
| cleaning up          | メモリの解放やStateを管理する変数をリセットする時間                                                                                                                               | 

処理時間を確認したい場合には、`Sending data` を確認するのがよさそう。

参考資料

- MySQL 5.7 Reference Manual
  - [Chapter 25 MySQL Performance Schema](https://dev.mysql.com/doc/refman/5.7/en/performance-schema.html)
  - [25.19.1 Query Profiling Using Performance Schema](https://dev.mysql.com/doc/refman/5.7/en/performance-schema-query-profiling.html)
  - [8.14.3 General Thread States](https://dev.mysql.com/doc/refman/5.7/en/general-thread-states.html)
- [MySQL 5.7入門（チューニング基礎編）](https://downloads.mysql.com/presentations/20151208_02_MySQL_Tuning_for_Beginners.pdf)
- [[Gihyo.jp] MySQLをチューニング，そしてスケールアップ／スケールアウトへ](https://gihyo.jp/dev/serial/01/MySQL-tuning-scale)
- [[Gihyo.jp] MySQL道普請便り](https://gihyo.jp/dev/serial/01/mysql-road-construction-news)
- [[Gihyo.jp] ゲームを題材に学ぶ 内部構造から理解するMySQL](https://gihyo.jp/dev/serial/01/game_mysql)
- [[Think It] MySQLマイスターに学べ！ 即効クエリチューニング 記事一覧](https://thinkit.co.jp/series/5588)

---

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

以下に主要な type をまとめているが、詳細は参考資料の [[USE THE INDEX LUKE] 実行計画 -MySQL-](https://use-the-index-luke.com/ja/sql/explain-plan/mysql) でまとめられている。

| type  | 概要                                                                                                                         | 
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | 
| const | インデックスを走査して、1行のみの該当レコードを見つける<br><br>必要に応じて行IDを参照して、テーブルからデータを取り出す      | 
| ref   | インデックスを走査して、一致するリーフノードをすべて検索する<br><br>必要に応じて行IDを参照して、テーブルからデータを取り出す | 
| index | インデックスの全行を順番に沿って読み込む<br>（INDEX FULL SCANに似ている）                                                    | 
| ALL   | テーブルの全行・全列を読み込む<br>（TABLE FULL SCAN）                                                                        | 

参考資料

- MySQL 5.7 Reference Manual
  - [8.8 Understanding the Query Execution Plan](https://dev.mysql.com/doc/refman/5.7/en/execution-plan-information.html)
- [[USE THE INDEX LUKE] 実行計画 -MySQL-](https://use-the-index-luke.com/ja/sql/explain-plan/mysql)

---

### SELECTクエリ その1

まずはインデックスを `hire_date` に対して作成し、`hire_date` の情報のみをSELECT文で抽出した場合にクエリが高速化されるのか検証する。

```sql
SELECT hire_date
FROM employees
WHERE hire_date = '1990-01-01';
```

実行結果として **65行** 抽出される。

なお以下に今回使用するインデックス主要項目の設定値を載せている。

| 項目         | 値            | 説明                                                                                                                                      | 
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | 
| Non_unique   | 1             | インデックスに重複を含むことができるかどうか<br><br>できない場合は`0`、できる場合は`1`<br><br>主キーのインデックスなどは `0` になっている | 
| Key_name     | hire_date_idx | インデックスの名称<br><br>主キーの場合は常に `PRIMARY`                                                                                    | 
| Seq_in_index | 1             | インデックス内のカラムのシーケンス番号<br><br>1から始める                                                                                 | 
| Colume_name  | hire_date     | 対象のカラム名                                                                                                                            | 
| Collation    | A             | インデックス内のソート方法<br><br>`A` で昇順、`NULL` でソートされていないことを表している                                                 | 
| Cardinality  | 4931          | インデックス内の一意の値の数の推定値<br><br>整数で格納されている統計情報をもとにカウントされるため常に正しいとは限らない                  | 
| Sub_part     | NULL          | 部分的にしかインデックス設定されていないかどうか<br><br>`NULL` なのでカラム全体がインデックス設定されている                               | 
| Index_Type   | BTREE         | 平衡木（`Balanced Tree`）を使用するインデックス<br><br>他には `FULLTEXT`、`HASH`、`RTREE` などがある                                      | 

#### 比較結果

まずはインデックスありなしでの実行計画を確認する。

| 比較項目      | インデックスなし | インデックスあり | 比較結果                                                                                                                                                                      | 
| ------------- | ---------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| type          | ALL              | ref              | `ALL` はフルテーブルスキャンでアクセス<br><br>`ref` は constではないインデックス（PKインデックスでもUniqueインデックスでもない）を使用して、等価検索（where k = v）でアクセス | 
| possible_keys | NULL             | hire_date_idx    | Optimizerが利用可能だと判断したインデックスが表示されている                                                                                                                   | 
| key           | NULL             | hire_date_idx    | Optimizerが実際に使用したインデックスが表示されている                                                                                                                         | 
| key_len       | NULL             | 3                | MySQLでは `Date` 型は3バイトのリトルエンディアンなので、Dateの値を使用している                                                                                                | 
| ref           | NULL             | const            | 検索条件のkeyと比較しているvalueの種類<br><br>今回は日付を定数として指定している                                                                                              | 
| rows          | 298980           | 65               | テーブルからfetchされる行数の見積もり                                                                                                                                         | 
| filtered      | 10.00            | 100.00           | テーブル条件によってフィルタリングされる行数の割合の見積もり                                                                                                                  | 
| Extra         | Using where      | Using index      | インデックスのみを参照してデータを抽出している                                                                                                                                | 

次に `performance_schema` を使用して実行時間を計測する。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | w/o index| w/ index |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0001 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0001 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0323 |   0.0000 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

実行計画やイベント情報を見てみても、インデックスを使用してクエリが高速化されていることがわかる。

### SELECTクエリ その2

まずはインデックスを `hire_date` に対して作成し、`hire_date` の情報だけではなく、インデックスを張っていない列の情報も取得するSELECT文で発行した場合にクエリが高速化されるのか検証する。

```sql
SELECT hire_date, first_name, last_name
FROM employees
WHERE hire_date = '1990-01-01';
```

#### 比較結果

実行計画自体は先ほどと変わらない。

イベント情報を確認すると確かに高速化されていることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | w/o index| w/ index |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0003 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0002 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0470 |   0.0002 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0001 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

### SELECTクエリ その3

次にインデックスを作成した列をもとにグルーピングを行った際に、処理が高速化するかどうか確認する。

```sql
SELECT hire_date 
FROM employees 
WHERE hire_date > '1990-01-01'
GROUP BY hire_date;
```

処理結果として **3636行** 抽出される。

#### 比較結果

以下に実行計画の中から特徴的なものを抽出した。

| 比較項目 | インデックスなし             | インデックスあり                      | 比較結果                                         | 
| -------- | ---------------------------- | ------------------------------------- | ------------------------------------------------ | 
| type     | ALL                          | range                                 | インデックスに対して範囲検索を実行している       | 
| ref      | NULL                         | NULL                                  |                                                  | 
| rows     | 298980                       | 2466                                  | 範囲指定なので等価比較よりも推定値が増大している | 
| filtered | 33.33                        | 100.00                                |                                                  | 
| Extra    | Using where; Using temporary | Using where; Using index for group-by | 詳細は以下                                       | 

- `Using where; Using temporary`
  - クエリを実行するとフルテーブルスキャンが実行される
  - 検索条件によってフェッチした行をフィルタリングする
  - `GROUP BY`を解決するために、結果を保持する一時テーブルを作成する
- `Using where; Using index for group-by`
  - インデックスのみを使用してデータにアクセスする
  - 検索条件によって対象の値をフィルタリングする
  - `GROUP BY`を実行するためにインデックスを効率的に使用する


イベント情報を確認すると確かに高速化されていることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0002 |   0.0002 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0001 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000 |   ------ |
| stage/sql/executing                            |   0.0593 |   0.0049 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   ------ |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

計測時間以外にも特徴的な部分としては、インデックスを使用している場合には一時テーブルが作成されていないことである。

> なおMySQLでは `GROUP BY col1, col2, ...` と指定した場合、暗黙的に `ORDER BY col1, col2, ...` のようにソート処理が実行されることに注意する。
> 今回はインデックスを作成している `hire_date` を指定しているため、昇順で並び方が実行済みである。

### SELECTクエリ その4

`WHERE` 句での検索条件に関数を使用した場合にインデックスにより高速化が実行されるのか確認する。

```sql
SELECT hire_date 
FROM employees 
WHERE MONTH(hire_date) = '12';
```

実行結果としては **24509行** 抽出される。

#### 比較結果

まずは実行計画から特徴的な項目を比較してみる。

| 比較項目      | インデックスなし | インデックスあり         | 比較結果                                                                 | 
| ------------- | ---------------- | ------------------------ | ------------------------------------------------------------------------ | 
| type          | ALL              | index                    | インデックス全体をスキャンする **フルインデックススキャン** でアクセス   | 
| possible_keys | NULL             | NULL                     | Optimizerが使用可能と判断したインデックスは存在しない                    | 
| key           | NULL             | hire_date_idx            | Optimizerは実際にはインデックスを使用している                            | 
| rows          | 298980           | 298980                   | インデックスなしと変わらない                                             | 
| filtered      | 100.00           | 100.00                   | インデックスなしと変わらない                                             | 
| Extra         | Using where      | Using where; Using index | インデックスをもとにレコードのポイントを取得し、各レコードを抽出している | 

ここからわかることは、検索条件にインデックスを作成したカラムに対して **関数を適用した値を使用している** 場合、**フルインデックススキャン** が発生しており、実際にテーブルから抽出したレコード数の推定値はフルテーブルスキャンの場合と変わらないということである。

イベント情報を見てみても実行時間に大差はない（むしろ遅い）。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | w/o index| w/ index |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0000 |   0.0003 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0327 |   0.0332 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

注意する必要があるのは、フルインデックススキャンのほうがフルテーブルスキャンよりも遅い可能性があるという点である。

例えばインデックスで参照する値がインデックスの後方に存在する場合、インデックスを順番にアクセスしていくと目的のキーに到達するまでにかなりの時間を必要としてしまい、シーケンシャルアクセスを実行するフルテーブルスキャンよりも遅くなってしまう可能性がある。

## 課題3

今回は比較のためにインデックスを新たに4つ作成する。

- `birth_date`
- `first_name`
- `last_name`
- `hire_date`

```sql
CREATE INDEX birth_date_idx ON employees (birth_date);
CREATE INDEX first_name_idx ON employees (first_name);
CREATE INDEX last_name_idx ON employees (last_name);
CREATE INDEX gender_idx ON employees (gender);
CREATE INDEX hire_date_idx ON employees (hire_date);
```

作成したインデックスを確認する。

```bash
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table     | Non_unique | Key_name       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| employees |          0 | PRIMARY        |            1 | emp_no      | A         |      298980 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| employees |          1 | birth_date_idx |            1 | birth_date  | A         |        4747 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| employees |          1 | first_name_idx |            1 | first_name  | A         |        1266 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| employees |          1 | last_name_idx  |            1 | last_name   | A         |        1651 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| employees |          1 | hire_date_idx  |            1 | hire_date   | A         |        4931 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| employees |          1 | gender_idx     |            1 | gender      | A         |           1 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
---
```

しっかりとそれぞれのカラムに応じてカーディナリティが反映されていることがわかる。
（推測値なので正確ではないが）

削除する際は以下のクエリを実行する。

```sql
DROP INDEX birth_date_idx ON employees;
DROP INDEX first_name_idx ON employees;
DROP INDEX last_name_idx ON employees;
DROP INDEX gender_idx ON employees;
DROP INDEX hire_date_idx ON employees;
```

### INSERT その1

以下のクエリを使用してデータを挿入する。

```sql
INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date)
VALUES (500000, '1980-01-30', 'Keisuke', 'Shimokawa', 'M', '1995-03-30');
```

#### 比較結果

インデックスが存在する場合は、`INSERT`文の処理にさらに時間がかかると考えていたが、想定に反してインデックスありの場合が処理速度が早くなっている。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | w/o index| w/ index |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0000 |   0.0002 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/update                               |   0.0001 |   0.0009 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0147 |   0.0075 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

> これは想定と異なる挙動のため、調査が必要である。

### INSERT その2

1件レコードを挿入する場合は想定と異なる挙動となってしまったため、複数件レコードを挿入する場合の処理結果を比較する。

```sql
INSERT INTO employees 
    (emp_no, birth_date, first_name, last_name, gender, hire_date)
VALUES
    (500000, '1980-01-01', 'aaaaaaa', 'bbbbbbb', 'M', '1990-03-30'),
    (500001, '1981-01-01', 'ccccccc', 'ddddddd', 'F', '1991-03-30'),
    (500002, '1982-01-01', 'hhhhhhh', 'iiiiiii', 'M', '1992-03-30'),
    (500003, '1983-01-01', 'kkkkkkk', 'jjjjjjj', 'F', '1993-03-30'),
    (500004, '1984-01-01', 'mmmmmmm', 'nnnnnnn', 'M', '1994-03-30'),
    (500005, '1985-01-01', 'ooooooo', 'ppppppp', 'F', '1995-03-30'),
    (500006, '1986-01-01', 'qqqqqqq', 'rrrrrrr', 'M', '1996-03-30'),
    (500007, '1987-01-01', 'sssssss', 'ttttttt', 'F', '1997-03-30'),
    (500008, '1988-01-01', 'uuuuuuu', 'wwwwwww', 'M', '1998-03-30'),
    (500009, '1989-01-01', 'yyyyyyy', 'zzzzzzz', 'F', '1999-03-30');
```

#### 比較結果

複数件レコードを挿入する場合は、インデックスがある方が余分な時間がかかっていることがわかる。

またインデックスなしの時には発生していなかった処理も増えており、余分なオーバーヘッドが発生していることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   ------ |   0.0000 |
| stage/sql/statistics                           |   ------ |   0.0000 |
| stage/sql/preparing                            |   ------ |   0.0000 |
| stage/sql/executing                            |   ------ |   0.0365 |
| stage/sql/end                                  |   ------ |   0.0000 |
| stage/sql/query end                            |   ------ |   0.0000 |
| stage/sql/waiting for handler commit           |   ------ |   0.0000 |
| stage/sql/closing tables                       |   ------ |   0.0000 |
| stage/sql/freeing items                        |   ------ |   0.0000 |
| stage/sql/cleaning up                          |   ------ |   0.0000 |
| stage/sql/starting                             |   ------ |   0.0002 |
| stage/sql/Executing hook on transaction begin. |   ------ |   0.0000 |
| stage/sql/starting                             |   ------ |   0.0000 |
| stage/sql/checking permissions                 |   ------ |   0.0000 |
| stage/sql/Opening tables                       |   ------ |   0.0000 |
| stage/sql/init                                 |   ------ |   0.0000 |
| stage/sql/System lock                          |   ------ |   0.0000 |
| stage/sql/update                               |   0.0001 |   0.0038 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0094 |   0.0161 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

> 1件レコードを挿入する場合にはインデックスが存在していることのオーバーヘッドが無視できる程度だった?

### DELETE その1

レコードを1件削除する場合で比較する。

```sql
DELETE FROM employees
WHERE emp_no = 500000;
```

#### 比較結果

1件削除する場合は、インデックスが存在しているほうが処理が遅くなっていることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0017 |   0.0014 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/updating                             |   0.0001 |   0.0001 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0073 |   0.0143 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

### DELETE その2

複数件レコードを削除する場合も比較する。

```sql
DELETE FROM employees
WHERE emp_no BETWEEN 500000 AND 500009;
```

#### 比較結果

複数件レコードを削除する場合でも、同じくインデックスが存在しているほうが処理が遅くなっていることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0014 |   0.0013 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/updating                             |   0.0001 |   0.0003 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0142 |   0.0177 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

### 補足情報

通常 `INSERT` 文をインデックスが存在するテーブルに実行すると、インデックスが存在しない場合と比較して処理時間が余分にかかってしまう。

今回では `INSERT` 文で追加する `birth_date` や `first_name` などのデータも新たに各インデックスの値に追加される。追加する際にも、データの順序と `B-tree` の木構造のバランスを保つために、通常のテーブルへの `INSERT` と比較して非常に重い処理になってしまう。

`DELETE` 文に関しても考え方は同じであり、指定したエントリを削除した後で、木構造のバランスを保つための処理などが重くなってしまう。ただし、 `WHERE` でのレコードの指定にはインデックスの恩恵を受けることができる点には注意が必要である。

`UPDATE` 文に関しては、更新する対象の列にインデックスが張られている場合に性能に影響を与えてしまう。そのため、更新対象の列は必要最低限の数に絞り込むことが有効である。
（ただし、ORMツールによっては自動的に全列が更新されてしまうため、ツールの挙動を把握しておくことが重要である。）
