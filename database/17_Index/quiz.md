# 課題4 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)
- [任意クイズ1（インデックスに関係ない問題）](#%E4%BB%BB%E6%84%8F%E3%82%AF%E3%82%A4%E3%82%BA1%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%AB%E9%96%A2%E4%BF%82%E3%81%AA%E3%81%84%E5%95%8F%E9%A1%8C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

雇用日（`hire_date`）毎に、雇用した男性の人数と女性の人数とその比率を表示させてみましょう。

また `hire_date` にインデックスを作成した場合にクエリは高速化されるでしょうか。

<details>
<summary>回答例</summary>

以下のクエリを実行すると、雇用日ごとの男女の割合がわかる。

結果としては **5435行** 選択される。

```sql
SELECT hire_date
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS COUNT_MAN
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS COUNT_FEMALE
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) / COUNT(*) AS RATE_MAN
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) / COUNT(*) AS RATE_FEMALE
FROM employees
GROUP BY hire_date
ORDER BY hire_date;
```

実行計画を見たところ、インデックスが存在しない場合はフルテーブルスキャンを実行しており、インデックスが存在している場合はフルインデックススキャンを実行していた。

実行時間を見てみると、インデックスが存在しているほうが余計に時間がかかっていることがわかる。

```bash
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |   0.0001  |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000  |   0.0000 |
| stage/sql/starting                             |   0.0000  |   0.0000 |
| stage/sql/checking permissions                 |   0.0000  |   0.0000 |
| stage/sql/Opening tables                       |   0.0000  |   0.0000 |
| stage/sql/init                                 |   0.0000  |   0.0000 |
| stage/sql/System lock                          |   0.0000  |   0.0000 |
| stage/sql/optimizing                           |   0.0000  |   0.0000 |
| stage/sql/statistics                           |   0.0000  |   0.0000 |
| stage/sql/preparing                            |   0.0000  |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000  |   ------ |
| stage/sql/executing                            |   0.2752  |   0.3925 |
| stage/sql/end                                  |   0.0000  |   0.0000 |
| stage/sql/query end                            |   0.0000  |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000  |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000  |   ------ |
| stage/sql/closing tables                       |   0.0000  |   0.0000 |
| stage/sql/freeing items                        |   0.0000  |   0.0000 |
| stage/sql/cleaning up                          |   0.0000  |   0.0000 |
+------------------------------------------------+-----------+----------+
```

</details>

## #2 クイズ

30歳のときに雇われた従業員に関して以下の情報を表示させてみましょう。

- `hire_date`
- `birth_date`
- `first_name`
- `last_name`

またインデックスを作成した場合にクエリは高速化されるでしょうか。

<details>
<summary>回答例</summary>

以下のクエリを実行すれば30歳にときに雇われた従業員を抽出できる。

結果としては **20849行** 抽出される。

```sql
SELECT hire_date, birth_date, first_name, last_name
FROM employees
WHERE FLOOR(DATEDIFF(hire_date, birth_date)/365) = 30;
```

インデックスを導入して高速化できるかというと、実験結果からはできないと考えられる。

実行計画を確認すると以下の全パターンでフルテーブルスキャンが発生している。

- インデックスなし
  - フルテーブルスキャン
- `hire_date`インデックスのみ
  - フルテーブルスキャン
- `birth_date`インデックスのみ
  - フルテーブルスキャン
- `hire_date`と`birth_date`の両方のインデックス
  - フルテーブルスキャン

イベント情報を見てみても実行時間に差が発生していないことがわかる。

```bash
+------------------------------------------------+-----------+-----------+------------+----------+
| Stage                                          | w/o index | hire_date | birth_date |     both |
+------------------------------------------------+-----------+-----------+------------+----------+
| stage/sql/starting                             |   0.0002  |   0.0001  |     0.0001 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0001  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0941  |   0.0964  |     0.0962 |   0.0999 |
| stage/sql/end                                  |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000  |   0.0000  |     0.0000 |   0.0000 |
+------------------------------------------------+-----------+-----------+------------+----------+
```

</details>

## 任意クイズ1（インデックスに関係ない問題）

`employees` テーブルに存在する従業員IDを意味する `emp_no` は、最小値が10001、最大値が499999であるため、単純に考えると従業員は全部で489998人存在しているはずだが、実際には300024件しか存在していない。

おそらく差分の189974人は退職してしまっているため従業員IDを削除したのではないかと考えられる。

実際に以下の条件をもとにテーブルから退職人数を計算してみましょう。

- 従業員ID `emp_no` は `auto-increment` 機能が付与されており、従業員を新たに追加するごとに従業員IDは1増加する

<details>
<summary>回答例</summary>

MySQL8.0以降だと問題ないけど、演習で使用している5.7のバージョンだと機能しないので、ほかの回答を探す必要がありそう。

```sql
WITH 
SLICED_EMPNO AS (
    SELECT emp_no AS base_emp_no
        ,MIN(emp_no) OVER (
            ORDER BY emp_no
            ROWS BETWEEN 1 FOLLOWING AND 1 FOLLOWING
        ) AS next_emp_no
    FROM employees
)
, DIFF_EMPNO AS (
    SELECT base_emp_no
        ,next_emp_no
        ,next_emp_no - base_emp_no AS DIFF
    FROM SLICED_EMPNO
)
SELECT 
    SUM(CASE WHEN DIFF != 1 AND DIFF IS NOT NULL THEN DIFF ELSE 0 END)
FROM DIFF_EMPNO;
```

</details>
