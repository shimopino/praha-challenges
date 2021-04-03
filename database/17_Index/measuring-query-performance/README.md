# クエリの性能計測

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [FAQ](#faq)
  - [Q1: SQL関数の実行時間を計測するにはどうすればいいでしょうか](#q1-sql%E9%96%A2%E6%95%B0%E3%81%AE%E5%AE%9F%E8%A1%8C%E6%99%82%E9%96%93%E3%82%92%E8%A8%88%E6%B8%AC%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q2: MySQL公式でサポートしている負荷エミュレーションツールの mysqlslap はどのように使えるでしょうか](#q2-mysql%E5%85%AC%E5%BC%8F%E3%81%A7%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E8%B2%A0%E8%8D%B7%E3%82%A8%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AE-mysqlslap-%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E4%BD%BF%E3%81%88%E3%82%8B%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q3: performance_schema に存在する setup_actors の用途は何でしょうか](#q3-performance_schema-%E3%81%AB%E5%AD%98%E5%9C%A8%E3%81%99%E3%82%8B-setup_actors-%E3%81%AE%E7%94%A8%E9%80%94%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q4: performance_schema に存在する setup_actors の各カラムの意味は何でしょうか](#q4-performance_schema-%E3%81%AB%E5%AD%98%E5%9C%A8%E3%81%99%E3%82%8B-setup_actors-%E3%81%AE%E5%90%84%E3%82%AB%E3%83%A9%E3%83%A0%E3%81%AE%E6%84%8F%E5%91%B3%E3%81%AF%E4%BD%95%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [5: MySQLで現在接続しているユーザー名とホスト名を確認するにはどうすればいいでしょうか](#5-mysql%E3%81%A7%E7%8F%BE%E5%9C%A8%E6%8E%A5%E7%B6%9A%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E5%90%8D%E3%81%A8%E3%83%9B%E3%82%B9%E3%83%88%E5%90%8D%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q6: performance_schema に存在する setup_actors に、現在接続しているユーザーとホストからイベント情報を収集する設定に変更してみましょう](#q6-performance_schema-%E3%81%AB%E5%AD%98%E5%9C%A8%E3%81%99%E3%82%8B-setup_actors-%E3%81%AB%E7%8F%BE%E5%9C%A8%E6%8E%A5%E7%B6%9A%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%A8%E3%83%9B%E3%82%B9%E3%83%88%E3%81%8B%E3%82%89%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E6%83%85%E5%A0%B1%E3%82%92%E5%8F%8E%E9%9B%86%E3%81%99%E3%82%8B%E8%A8%AD%E5%AE%9A%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [Q7: クエリの実行速度を計測する際に、performance_schema に存在する setup_instruments にどのような設定を追加すればいいでしょうか](#q7-%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E5%AE%9F%E8%A1%8C%E9%80%9F%E5%BA%A6%E3%82%92%E8%A8%88%E6%B8%AC%E3%81%99%E3%82%8B%E9%9A%9B%E3%81%ABperformance_schema-%E3%81%AB%E5%AD%98%E5%9C%A8%E3%81%99%E3%82%8B-setup_instruments-%E3%81%AB%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q8: クエリの実行速度を計測する際に、performance_schema に存在する setup_consumers にどのような設定を追加すればいいでしょうか](#q8-%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E5%AE%9F%E8%A1%8C%E9%80%9F%E5%BA%A6%E3%82%92%E8%A8%88%E6%B8%AC%E3%81%99%E3%82%8B%E9%9A%9B%E3%81%ABperformance_schema-%E3%81%AB%E5%AD%98%E5%9C%A8%E3%81%99%E3%82%8B-setup_consumers-%E3%81%AB%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q9: 発行したクエリに紐づいている履歴情報のクエリIDを調べるためにはどうすればいいでしょうか](#q9-%E7%99%BA%E8%A1%8C%E3%81%97%E3%81%9F%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AB%E7%B4%90%E3%81%A5%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B%E5%B1%A5%E6%AD%B4%E6%83%85%E5%A0%B1%E3%81%AE%E3%82%AF%E3%82%A8%E3%83%AAid%E3%82%92%E8%AA%BF%E3%81%B9%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q10: 発行したクエリのクエリIDから実行時間を取得するにはどうすればいいでしょうか](#q10-%E7%99%BA%E8%A1%8C%E3%81%97%E3%81%9F%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E3%82%AF%E3%82%A8%E3%83%AAid%E3%81%8B%E3%82%89%E5%AE%9F%E8%A1%8C%E6%99%82%E9%96%93%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q11: クエリを実行する際に強制的にインデックスを使用するにはどうすればいいでしょうか](#q11-%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B%E9%9A%9B%E3%81%AB%E5%BC%B7%E5%88%B6%E7%9A%84%E3%81%AB%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
    - [インデックスを強制した場合](#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%82%92%E5%BC%B7%E5%88%B6%E3%81%97%E3%81%9F%E5%A0%B4%E5%90%88)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## FAQ

### Q1: SQL関数の実行時間を計測するにはどうすればいいでしょうか

MySQLで関数単体の実行速度を計測できるベンチマーク用の関数は何でしょうか。

<details>
<summary>回答例</summary>

`BENCHMARK(計測回数, 計測関数)`関数を使用することで、計測したい関数を指定した回数だけ実行してその実行時間を返す。

例えば以下は現在時刻を取得する関数のベンチマークをとっている。

```bash
mysql> SELECT BENCHMARK(1000000, NOW());
+---------------------------+
| BENCHMARK(1000000, NOW()) |
+---------------------------+
|                         0 |
+---------------------------+
```

この関数を使用する際の注意点としては、サーバー上でのCPU時間ではなく、クライアント側の経過時間を計測している点であり、サーバー側の負荷の状況によって結果が前後する可能性があるため、複数回実行することが推奨されている。

- [`BENCHMARK(計測回数, 計測関数)`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_benchmark)

</details>

### Q2: MySQL公式でサポートしている負荷エミュレーションツールの mysqlslap はどのように使えるでしょうか

<details>
<summary>回答例</summary>

`mysqlslap` を使用することで複数のクライアントが同時にアクセスするような状況での負荷テストを実行することができる。

例えば以下のコマンドでは、`INT`型の列を2つ、`VARCAHR`型の列を3つ有しているテーブルに対して、5人のクライアントがクエリを20回発行する状況での負荷テストを実行している。

```bash
root@f080c363072e:/# mysqlslap -uroot -pcollege --concurrency=5 --iterations=20 --number-int-cols=2 --number-char-cols=3 --auto-generate-sql
mysqlslap: [Warning] Using a password on the command line interface can be insecure.
Benchmark
        # 平均実行時間
        Average number of seconds to run all queries: 0.062 seconds
        # 最小実行時間
        Minimum number of seconds to run all queries: 0.052 seconds
        # 最大実行時間
        Maximum number of seconds to run all queries: 0.087 seconds
        # クライアントの数
        Number of clients running queries: 5
        # 1クライアントが発行するSQLの数
        Average number of queries per client: 0
```

`--only-print`を付与すれば実際に発行しているクエリを確認できる。

参考資料

- [4.5.8 mysqlslap — A Load Emulation Client](https://dev.mysql.com/doc/refman/8.0/en/mysqlslap.html)

</details>

### Q3: performance_schema に存在する setup_actors の用途は何でしょうか

<details>
<summary>回答例</summary>

ホストやユーザー、アカウントの情報を使って収集するクエリの対象を絞り込むことで、履歴テーブルからデータを収集する際のオーバーヘッドやデータ量を削減するために使用される。

参考資料

- [27.12.2.1 The setup_actors Table](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-setup-actors-table.html)

</details>

### Q4: performance_schema に存在する setup_actors の各カラムの意味は何でしょうか

以下のクエリを発行した際に得られる結果を解釈してください。

```bash
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

<details>
<summary>回答例</summary>

- 全てのホストの、全てのユーザーから、統計情報と、イベントのログを収集する

| カラム名 | 説明                                                                                       | 
| -------- | ------------------------------------------------------------------------------------------ | 
| HOST     | ホスト名<br><br>リテラルを指定するか、`%`ですべてのホストを指定する                        | 
| USER     | ホスト名<br><br>リテラルを指定するか、`%`ですべてのホストを指定する                        | 
| ROLE     | 使用されていない                                                                           | 
| ENABLED  | フォアグラウンドスレッドでの統計情報を収集するかどうか<br><br>`YES` 、あるいは `NO` で指定 | 
| HISTORY  | フォアグラウンドスレッドでのイベントを収集するかどうか<br><br>`YES` 、あるいは `NO` で指定 | 

参考資料

- [27.12.2.1 The setup_actors Table](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-setup-actors-table.html)

</details>

### 5: MySQLで現在接続しているユーザー名とホスト名を確認するにはどうすればいいでしょうか

<details>
<summary>回答例</summary>

`CURRENT_USER()`関数を使用する。

```bash
mysql> SELECT current_user();
+----------------+
| current_user() |
+----------------+
| root@localhost |
+----------------+
```

</details>

### Q6: performance_schema に存在する setup_actors に、現在接続しているユーザーとホストからイベント情報を収集する設定に変更してみましょう

- ユーザー名は `root`
- ホスト名は `localhost`

<details>
<summary>回答例</summary>

デフォルトで `setup_actors` には全てのホストとユーザーに関するイベントを収集する設定になっているので、制限を加えるようにレコードを変更する。

```bash
# まずは全てのホストとユーザーに関する設定をOFFにする
mysql> UPDATE performance_schema.setup_actors
    ->        SET ENABLED = 'NO', HISTORY = 'NO'
    ->        WHERE HOST = '%' AND USER = '%';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# 次に指定のユーザーとホストのみ設定をONする
mysql> INSERT INTO performance_schema.setup_actors
    ->        (HOST,USER,ROLE,ENABLED,HISTORY)
    ->        VALUES('localhost','root','%','YES','YES');
Query OK, 1 row affected (0.01 sec)
```

これで以下の状態になっていればOKである。

```bash
mysql> SELECT * FROM performance_schema.setup_actors;
+-----------+------+------+---------+---------+
| HOST      | USER | ROLE | ENABLED | HISTORY |
+-----------+------+------+---------+---------+
| %         | %    | %    | NO      | NO      |
| localhost | root | %    | YES     | YES     |
+-----------+------+------+---------+---------+
```

</details>

### Q7: クエリの実行速度を計測する際に、performance_schema に存在する setup_instruments にどのような設定を追加すればいいでしょうか

<details>
<summary>回答例</summary>

`setup_instruments` テーブルには、MySQLサーバのソースコード内に設定されている処理時間や待機時間を収集するための `instruments` という設定をONにする。

```bash
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES'
       WHERE NAME LIKE '%statement/%';

mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES'
       WHERE NAME LIKE '%stage/%';
```

</details>

### Q8: クエリの実行速度を計測する際に、performance_schema に存在する setup_consumers にどのような設定を追加すればいいでしょうか

<details>
<summary>回答例</summary>

`setup_consumers` テーブルには、`performance_schema` が計測した統計情報を記録するのか設定することができる。

- `events_statement_%`
  - 前回設定した `statement` 単位での統計情報を記録する
  - `SQL_TEXT` とイベントIDとを紐づけるために使用する
- `events_stages_%`
  - クエリをプロファイルするための情報を記録する

```bash
mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES'
       WHERE NAME LIKE '%events_statements_%';

mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES'
       WHERE NAME LIKE '%events_stages_%';
```

</details>

### Q9: 発行したクエリに紐づいている履歴情報のクエリIDを調べるためにはどうすればいいでしょうか

調査対象のクエリは以下になります。

```bash
mysql> SELECT * FROM employees.employees WHERE emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

<details>
<summary>回答例</summary>

`events_statements_history_long` テーブルには過去に発行したクエリの情報が格納されている。

```bash
mysql> SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
       FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like '%10001%';
+----------+----------+--------------------------------------------------------+
| event_id | duration | sql_text                                               |
+----------+----------+--------------------------------------------------------+
|       31 | 0.028310 | SELECT * FROM employees.employees WHERE emp_no = 10001 |
+----------+----------+--------------------------------------------------------+
```

</details>

### Q10: 発行したクエリのクエリIDから実行時間を取得するにはどうすればいいでしょうか

<details>
<summary>回答例</summary>

`events_stages_history_long` テーブルには、各Stageとその実行時間が計測されている。

```bash
mysql> SELECT event_name AS Stage, TRUNCATE(TIMER_WAIT/1000000000000,6) AS Duration
       FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=31;
+--------------------------------+----------+
| Stage                          | Duration |
+--------------------------------+----------+
| stage/sql/starting             | 0.000080 |
| stage/sql/checking permissions | 0.000005 |
| stage/sql/Opening tables       | 0.027759 |
| stage/sql/init                 | 0.000052 |
| stage/sql/System lock          | 0.000009 |
| stage/sql/optimizing           | 0.000006 |
| stage/sql/statistics           | 0.000082 |
| stage/sql/preparing            | 0.000008 |
| stage/sql/executing            | 0.000000 |
| stage/sql/Sending data         | 0.000017 |
| stage/sql/end                  | 0.000001 |
| stage/sql/query end            | 0.000004 |
| stage/sql/closing tables       | 0.000006 |
| stage/sql/freeing items        | 0.000272 |
| stage/sql/cleaning up          | 0.000001 |
+--------------------------------+----------+
```

</details>

### Q11: クエリを実行する際に強制的にインデックスを使用するにはどうすればいいでしょうか

<details>
<summary>回答例</summary>

#### インデックスを強制した場合

`FORCE INDEX (<index>)` 構文を使用すればインデックスを強制的に使用することができる。

```sql
SELECT hire_date, first_name, last_name
FROM employees
FORCE INDEX (hire_date_idx)
WHERE hire_date = '1990-01-01';
```

この時に実行計画を確認すれば、クエリがインデックスを利用していることがわかるはずである。

</details>

## 参考資料

- [[MySQL 8.0 Reference] 8.13 Measuring Performance (Benchmarking)](https://dev.mysql.com/doc/refman/8.0/en/optimize-benchmarking.html)
- [[MySQL 8.0 Reference] 27.19 Using the Performance Schema to Diagnose Problems](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-examples.html)
