# 課題18「複合インデックスを理解する」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
- [実際の並び順の確認](#%E5%AE%9F%E9%9A%9B%E3%81%AE%E4%B8%A6%E3%81%B3%E9%A0%86%E3%81%AE%E7%A2%BA%E8%AA%8D)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [クエリその1](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE1)
  - [クエリその2](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE2)
  - [クエリその3](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

**複合インデックス** とは複数の列をひとかたまりで扱うことのできるインデックスである。

例えばMySQLの[公式ドキュメント](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)で使用されている以下のテーブル定義を考える。

```sql
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

このときに例えば以下のクエリを実行すると、複合インデックスの最初の列である `last_name` を使用して絞り込みを行い、そのあとで2番目の列である `first_name` を使用して絞り込むことで、フルテーブルスキャンを行うことなく目的のレコードを抽出することができる。

```sql
SELECT * FROM test
WHERE last_name='Jones' AND first_name='John';
```

複合インデックスでは、指定する列の順番に気を付ける必要があり、例えば以下のっクエリを実行すると、インデックスは使用されずにフルテーブルスキャンが実行される。

```sql
SELECT * FROM test
WHERE last_name='Jones' OR first_name='John';
```

これは複合インデックスでは、最初の列である `last_name` を基準にリーフノードが構築されており、そのリーフノードの中の順番はばらばらであるため、`first_name` が `John` であるエントリを探すには、結局すべてのインデックスを走査する必要があるためである。

課題として提示されている以下の複合インデックスでも、検索クエリで `last_name`、つまり姓のみを指定している場合は、フルテーブルスキャンになってしまう。

```sql
CREATE INDEX employees_name ON employees (first_name, last_name)
```

複合インデックスを使用する場合には、最も検索で使用する列をインデックスの最初に持ってくることで、より多くのクエリに対して複合インデックスの恩恵を受けることができるようになる。

## 実際の並び順の確認

以下のクエリを実行して複合インデックスの並び順を確認することができる。

```sql
SELECT last_name, first_name
FROM employees
ORDER BY last_name, first_name
LIMIT 1000;
```

この結果として最初の列である `last_name` を基準に並び替えが実行されており、特定の `last_name` の中でさらに `first_name` が並び替えられていることがわかる。

```bash
+-----------+------------+
| last_name | first_name |
+-----------+------------+
| Aamodt    | Abdelkader |
| Aamodt    | Adhemar    |
| Aamodt    | Aemilian   |
| Aamodt    | Alagu      |
| Aamodt    | Aleksander |
| Aamodt    | Alexius    |
| Aamodt    | Alois      |
| Aamodt    | Aluzio     |
| Aamodt    | Amabile    |
| Aamodt    | Anestis    |
+-----------+------------+
```

このことからも2番目の列である `first_name` だけを指定した絞り込みでは、複合インデックスは役に立たないことがわかる。

## 課題2

### クエリその1

> 1960年1月1日に生まれた `last_name` が `Kr` から始まる従業員の全情報を抽出する。

```sql
SELECT *
FROM employees
WHERE birth_date = '1960-01-01'
AND last_name LIKE 'Kr%';
```

実行結果は以下になる。

```bash
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  41931 | 1960-01-01 | Bartek     | Kropatsch | F      | 1985-05-27 |
| 215045 | 1960-01-01 | Zhiwei     | Krybus    | F      | 1990-09-11 |
| 239203 | 1960-01-01 | Masamitsu  | Kropf     | M      | 1994-03-16 |
| 401838 | 1960-01-01 | Masadi     | Kroft     | F      | 1994-12-13 |
+--------+------------+------------+-----------+--------+------------+
```

ではクエリの高速化のために以下の複合インデックスを使用して検索速度を比較する。

```sql
CREATE INDEX bdate_lname_idx ON employees (birth_date, last_name);
```

まずは実行計画を確認する。

```bash
*************** w/o index ***************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298990
     filtered: 1.11
        Extra: Using where
*************** w/ index ***************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: range
possible_keys: bdate_lname_idx
          key: bdate_lname_idx
      key_len: 69
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: Using index condition
```

- 結果
  - `type: range`
    - 複合インデックスを使って範囲検索を行っている
  - `key: bdate_lname_idx`
    - Optimizerによって複合インデックスが使用されている
  - `Extra: Using index condition`
    - インデックスコンディションプッシュダウンによる最適化
    - つまりは、インデックスのキーを使用して WHERE による絞り込みを先に実行することで、不必要にテーブルのレコードを読み込みことを避けている

次に検索時間を比較する。

```bash
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |    0.0001 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/Opening tables                       |    0.0001 |   0.0000 |
| stage/sql/init                                 |    0.0000 |   0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0084 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/executing                            |    0.0655 |   0.0009 |
| stage/sql/end                                  |    0.0000 |   0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |
| stage/sql/freeing items                        |    0.0000 |   0.0004 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |
+------------------------------------------------+-----------+----------+
| total                                          |    0.0659 |   0.0100 |
+------------------------------------------------+-----------+----------+
```

- 結果
  - `stage/sql/statistics`
    - スレッドが実行計画を構築するために統計情報を計算している状態
  - `stage/sql/executing`
    - スレッドがクエリを実行している状態

> インデックスを使用している場合に統計情報の計算時間が増加している理由は何だろうか

参考情報

- [[MySQL 8.0 Reference] 8.14.3 General Thread States](https://dev.mysql.com/doc/refman/8.0/en/general-thread-states.html)

### クエリその2

> 1989年10月1日から1990年10月1日までに雇われた男性従業員の全情報を抽出する。

```sql
SELECT *
FROM employees
WHERE hire_date BETWEEN '1980-10-01' AND '1990-10-01'
AND gender = 'M';
```

実行結果は以下になる。

```bash
+--------+------------+------------+-------------+--------+------------+
| emp_no | birth_date | first_name | last_name   | gender | hire_date  |
+--------+------------+------------+-------------+--------+------------+
|  10077 | 1964-04-18 | Mona       | Azuma       | M      | 1990-03-02 |
|  10082 | 1963-09-09 | Parviz     | Lortz       | M      | 1990-01-03 |
|  10086 | 1962-11-19 | Somnath    | Foote       | M      | 1990-02-16 |
|  10096 | 1954-09-16 | Jayson     | Mandell     | M      | 1990-01-14 |
|  10097 | 1952-02-27 | Remzi      | Waschkowski | M      | 1990-09-15 |
   .....   ..........   .....        ...........   .        ..........
```

ではクエリの高速化のために以下の複合インデックスを使用して検索速度を比較する。

```sql
CREATE INDEX hdate_gender_idx ON employees (hire_date, gender);
```

まずは実行計画を確認する。

```bash
*************** w/o index ***************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298990
     filtered: 5.56
        Extra: Using where
*************** w/  index ***************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: range
possible_keys: hdate_gender_idx
          key: hdate_gender_idx
      key_len: 4
          ref: NULL
         rows: 50030
     filtered: 50.00
        Extra: Using index condition
1 row in set, 1 warning (0.00 sec)
```

- 結果
  - `type: range`
    - インデックスに対して範囲検索を行っている
  - `rows: 50030`
    - 推測値ではあるが、クエリその1と比較するとかなりのレコードを走査していることがわかる

次に検索時間を比較する。

```
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |    0.0001 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/Opening tables                       |    0.0000 |   0.0000 |
| stage/sql/init                                 |    0.0000 |   0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0014 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/executing                            |    0.0975 |   0.0348 |
| stage/sql/end                                  |    0.0000 |   0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |
| stage/sql/freeing items                        |    0.0000 |   0.0000 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |
+------------------------------------------------+-----------+----------+
| total                                          |    0.0978 |   0.0366 |
+------------------------------------------------+-----------+----------+
```

検索速度が向上していることがわかる。

相変わらず統計情報の計算に多少時間がかかっていることがわかる。

### クエリその3

> 1989年10月1日から1990年10月1日までに雇われた女性従業員の中から最も若い従業員の全情報を抽出する。

```sql
WITH
TARGET_FEMALE AS (
    SELECT *
    FROM employees
    WHERE hire_date BETWEEN '1989-10-01' AND '1990-10-01'
    AND gender = 'F'
)
SELECT *
FROM TARGET_FEMALE
WHERE birth_date = (
    SELECT MAX(birth_date)
    FROM TARGET_FEMALE
);
```

実行結果は以下になる。

```bash
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
| 411906 | 1965-02-01 | Anneli     | Pappas    | F      | 1990-07-09 |
+--------+------------+------------+-----------+--------+------------+
```

ではクエリの高速化のために以下の複合インデックスを使用して検索速度を比較する。

```sql
CREATE INDEX hdate_gender_idx ON employees (hire_date, gender);
```

まずは実行計画を確認する。

```bash
*************** w/o index 1 ***************
           id: 1
  select_type: PRIMARY
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298990
     filtered: 0.56
        Extra: Using where
*************** w/o index 2 ***************
           id: 3
  select_type: SUBQUERY
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298990
     filtered: 5.56
        Extra: Using where

*************** w/o index 1 ***************
           id: 1
  select_type: PRIMARY
        table: employees
   partitions: NULL
         type: range
possible_keys: hdate_gender_idx
          key: hdate_gender_idx
      key_len: 4
          ref: NULL
         rows: 49920
     filtered: 5.00
        Extra: Using index condition; Using where
*************** w/o index 2 ***************
           id: 3
  select_type: SUBQUERY
        table: employees
   partitions: NULL
         type: range
possible_keys: hdate_gender_idx
          key: hdate_gender_idx
      key_len: 4
          ref: NULL
         rows: 49920
     filtered: 50.00
        Extra: Using index condition
```

- 結果
  - `select_type: SUBQUERY`
    - `WITH`句で指定しているサブクエリを示している。
  - `select_type: PRIMARY`
    - 最も外側の `SELECT` 文の実行計画であり、`TARGET_FEMALE` 抽出時のインデックスの使用と、`birth_date` での `WHERE` 句指定の組み合わせである。

次に検索時間を比較する。

```
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |    0.0001 |   0.0002 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/Opening tables                       |    0.0002 |   0.0001 |
| stage/sql/init                                 |    0.0000 |   0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0001 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0000 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/executing                            |    0.0000 |   0.0002 |
| stage/sql/executing                            |    0.1468 |   0.0342 |
| stage/sql/end                                  |    0.0000 |   0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |
| stage/sql/freeing items                        |    0.0081 |   0.0000 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |
+------------------------------------------------+-----------+----------+
|                                                |    0.1556 |   0.0352 |
+------------------------------------------------+-----------+----------+
```

検索速度が向上していることがわかる。
