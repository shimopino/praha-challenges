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
     filtered: 100.00
        Extra: Using temporary; Using filesort
```

`GROUP BY` や `ORDER BY` などの処理や、`CASE`文での分岐処理に時間がかかっていそうな気もするので、クエリを単純なものから複雑化させていくことでボトルネックとなっている処理を確認する。

| query                          | execution time | 
| ------------------------------ | -------------- | 
| SELECT salary<br>FROM salaries | 0.4966         | 
| + salary_class                 | 0.6055         | 
| + GROUP BY salary_class        | 0.8619         | 
| + emp_count                    | 1.0987         | 
| + ORDER BY emp_count DESC      | 1.4216         | 

`DISTINCT` で従業員の被りが出ないようにしている処理や、`GROUP BY` で一時テーブルを作成している処理に時間がかかっていることがわかる。

ではクエリで使用している `salary` に対してインデックスを作成することで処理が高速化するのか確認する。

```sql
CREATE INDEX salary_idx ON salaries (salary);
```

なお今回は条件での絞り込みを行っていないため、`salary` に対してインデックスを作成してカバリングインデックスにすることで、直接テーブルから行をフェッチすることなく処理させることでの高速化を狙っている。

実行計画は以下のようになっており、想定通りにインデックスから値を参照していることがわかる（フルインデックススキャン）。

```bash
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: NULL
         type: index
possible_keys: salary_idx
          key: salary_idx
      key_len: 4
          ref: NULL
         rows: 2838426
     filtered: 100.00
        Extra: Using index; Using temporary; Using filesort
```

では先ほどと同様に単純なクエリから複雑なクエリにしていくことで、どこでインデックスの効果が発揮されているのか確認する。

| query                          | execution time | 
| ------------------------------ | -------------- | 
| SELECT salary<br>FROM salaries | 0.3992         | 
| + salary_class                 | 0.4501         | 
| + GROUP BY salary_class        | 0.7781         | 
| + emp_count                    | 1.7794         | 
| + ORDER BY emp_count DESC      | 1.7425         | 

インデックスが効果を発揮していないことがわかる。

これはインデックスはあくまでもレコードを絞り込む際に使用すべきものであり、フェッチすべきレコード数が増加してしまうと、シーケンシャルアクセスによるオーバーヘッドが、フルテーブルスキャンでのマルチブロックリードよりも時間がかかってしまうためだと考えられる。

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