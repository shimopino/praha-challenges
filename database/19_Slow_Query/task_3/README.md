# 課題3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [頻度の高いクエリの高速化](#%E9%A0%BB%E5%BA%A6%E3%81%AE%E9%AB%98%E3%81%84%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E9%AB%98%E9%80%9F%E5%8C%96)
- [実行時間が長いクエリの高速化](#%E5%AE%9F%E8%A1%8C%E6%99%82%E9%96%93%E3%81%8C%E9%95%B7%E3%81%84%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E9%AB%98%E9%80%9F%E5%8C%96)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 頻度の高いクエリの高速化

頻度が高いわけではないが、以下のクエリの高速化を目指す。

> 特定の給料レンジの従業員数を出力する。
> なお従業員の給料が最新（つまり `to_date` が '9999-01-01'）の給料を使用する。

```sql
SELECT
    CASE 
    WHEN salary <= 50000  THEN 'low'
    WHEN salary <= 100000 THEN 'middle'
    WHEN salary <= 150000 THEN 'middle_high'
    ELSE 'high'
    END AS salary_class
   ,COUNT(DISTINCT emp_no) AS emp_count
FROM salaries
WHERE to_date = '9999-01-01'
GROUP BY salary_class
ORDER BY emp_count DESC;
```

まずは実行計画を確認する。

```bash
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 2838426
     filtered: 10.00
        Extra: Using where; Using temporary; Using filesort
```

`GROUP BY` や `ORDER BY` などの処理や、`CASE`文での分岐処理に時間がかかっていそうな気もするので、クエリを単純なものから複雑化させていくことでボトルネックとなっている処理を確認する。

| query                          | execution time | 
| ------------------------------ | -------------- | 
| SELECT salary<br>FROM salaries | 0.4809         | 
| + WHERE to_date = '9999-01-01' | 0.4469         | 
| + salary_class                 | 0.4184         | 
| + GROUP BY salary_class        | 0.5041         | 
| + emp_count<br>                | 0.5623         | 
| + ORDER BY emp_count DESC      | 0.5634         | 

そもそもの最初のテーブル読み込み時間がかかっており、その他の処理はそれほど負荷が高くなっていないことがわかる。

ではクエリで使用している `salary` に対してインデックスを作成することで処理が高速化するのか確認する。

```sql
CREATE INDEX salary_idx ON salaries (salary);
```

なお今回は条件での絞り込みを行っていないため、`salary` に対してインデックスを作成してカバリングインデックスにすることで、直接テーブルから行をフェッチすることなく処理させることでの高速化を狙っている。

実行計画は以下のようになっており、今回作成したインデックスは使用されていないことがわかる。

```bash
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: NULL
         type: ALL
possible_keys: salary_idx
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 2838426
     filtered: 10.00
        Extra: Using where; Using temporary; Using filesort
```

なお `FORCE INDEX (salary_idx)` を指定すると `0.6067` 秒かかっており、インデックスを使用していない場合とそれほど実行時間が変化していない。

これはインデックスはあくまでもレコードを絞り込む際に使用すべきものであり、フェッチすべきレコード数が増加してしまうと、シーケンシャルアクセスによるオーバーヘッドが、フルテーブルスキャンでのマルチブロックリードよりも時間がかかってしまうためだと考えられる。

### インデックスによる効果の再検証

今度はフェッチするレコードを絞り込むようなクエリを実行することで、インデックスの効果を再検証する。

> 特定の給料レンジの従業員を出力する。
> なお対象の従業員は、1989年1月1日から1990年に入社した、男性従業員のみにしてみましょう。

```sql
SELECT
    CASE 
    WHEN salary <= 50000  THEN 'low'
    WHEN salary <= 100000 THEN 'middle'
    WHEN salary <= 150000 THEN 'middle_high'
    ELSE 'high'
    END AS salary_class
   ,COUNT(DISTINCT salaries.emp_no) AS emp_count
FROM salaries
INNER JOIN employees ON salaries.emp_no = employees.emp_no
AND employees.hire_date BETWEEN '1989-01-01' AND '1990-01-01'
AND employees.gender = 'M'
AND salaries.to_date = '9999-01-01'
GROUP BY salary_class
ORDER BY emp_count DESC;
```

実行結果は以下のようになる。

```bash
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ALL
possible_keys: PRIMARY
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298990
     filtered: 5.56
        Extra: Using where; Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: NULL
         type: ref
possible_keys: PRIMARY,salary_idx
          key: PRIMARY
      key_len: 4
          ref: employees.employees.emp_no
         rows: 9
     filtered: 10.00
        Extra: Using where
```

## 実行時間が長いクエリの高速化

課題1で実行した以下のクエリの高速化を目指す。

> 従業員の役職ごとに給料の最低値、平均値、最高値を算出する

```sql
SELECT title
      ,MIN(salary) AS Minimum
      ,ROUND(SUM(salary) / COUNT(salary)) AS Mean
      ,MAX(salary) As Maximum
FROM employees
INNER JOIN titles ON titles.emp_no = employees.emp_no
INNER JOIN salaries ON salaries.emp_no = employees.emp_no
GROUP BY title;
```

> ぱっと考えた限りでは、結合に使用しているキーはそれぞれのテーブルの主キーでありインデックスもデフォルトで存在していることや、実行計画を確認してもインデックスを使用しているため、インデックスを作成することによる高速化は難しそうな印象

まずはどの処理に実行時間がかかっているのか計測するが、`performance_schema`では各句ごとの実行時間の計測方法がわからなかったため、クエリを1つ1つ複雑化させていくことで実行時間を計測した。

- `0.5019` 秒
  - 2つのテーブルの結合はさほど処理が重くはない
  - ちなみにこれは 300034 件のレコードが存在している `employees` テーブルと、443308 件のレコードが存在している `titles` テーブルの結合である

    ```sql
    SELECT title
    FROM employees
    INNER JOIN titles ON employees.emp_no = titles.emp_no
    ```

- ``


4.3032

SELECT title
      ,MIN(salary) AS Minimum
      ,ROUND(SUM(salary) / COUNT(salary)) AS Mean
      ,MAX(salary) As Maximum
FROM employees
INNER JOIN titles ON titles.emp_no = employees.emp_no
INNER JOIN salaries ON salaries.emp_no = employees.emp_no
GROUP BY title;

0.4747

SELECT title
FROM employees
INNER JOIN titles ON employees.emp_no = titles.emp_no

2.5683

SELECT title
FROM employees
INNER JOIN titles ON employees.emp_no = titles.emp_no
INNER JOIN salaries ON employees.emp_no = salaries.emp_no