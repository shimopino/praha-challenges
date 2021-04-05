# 課題18「複合インデックスを理解する」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
- [調査結果](#%E8%AA%BF%E6%9F%BB%E7%B5%90%E6%9E%9C)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [クエリその1](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE1)
  - [クエリその2](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE2)
  - [クエリその3](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE3)
- [課題3](#%E8%AA%B2%E9%A1%8C3)

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

### クエリその3

## 課題3


