# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [mysqldumpslow とは何か](#mysqldumpslow-%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [mysqldumpslow で設定可能なオプション](#mysqldumpslow-%E3%81%A7%E8%A8%AD%E5%AE%9A%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## mysqldumpslow とは何か

[`mysqldumpslow`](https://dev.mysql.com/doc/refman/8.0/en/mysqldumpslow.html) を使用すると、スロークエリログを解析して内容を理解しやすい形で表示できるコマンドである。

`mysqldumpslow` では、数値や文字列などの値を覗いて、似ているクエリをグルーピングしている。

試しに課題1で出力したスロークエリログを対象に使用してみる。

```bash
> mysqldumpslow /var/lib/mysql/slow_query.log 

Reading mysql slow query log from /var/lib/mysql/slow_query.log
Count: 1  Time=4.41s (4s)  Lock=0.00s (0s)  Rows=7.0 (7), root[root]@localhost
  SELECT title
  ,MIN(salary) AS Minimum
  ,ROUND(SUM(salary) / COUNT(salary)) AS Mean
  ,MAX(salary) As Maximum
  FROM employees
  INNER JOIN titles ON titles.emp_no = employees.emp_no
  INNER JOIN salaries ON salaries.emp_no = employees.emp_no
  GROUP BY title

Count: 1  Time=1.62s (1s)  Lock=0.00s (0s)  Rows=4.0 (4), root[root]@localhost
  SELECT
  CASE 
  WHEN salary <= N  THEN 'S'
  WHEN salary <= N THEN 'S'
  WHEN salary <= N THEN 'S'
  ELSE 'S'
  END AS salary_class
  ,COUNT(DISTINCT emp_no) AS emp_count
  FROM salaries
  GROUP BY salary_class
  ORDER BY emp_count DESC

Count: 1  Time=0.78s (0s)  Lock=0.00s (0s)  Rows=9.0 (9), root[root]@localhost
  SELECT departments.dept_no
  ,MIN(dept_name)
  ,SUM(CASE WHEN gender = 'S' THEN N ELSE N END) AS MAN_COUNT
  ,SUM(CASE WHEN gender = 'S' THEN N ELSE N END) AS FEMALE_COUNT
  FROM employees
  INNER JOIN dept_emp ON dept_emp.emp_no = employees.emp_no
  INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
  GROUP BY dept_emp.dept_no
```

注目すべき点は、`CASE`文などで指定していた数値や文字列が特定の値に置換されている点である。

こうすることでただ単に数値や文字列が異なるだけのクエリは、全く同じものだと認識させることができる。

## mysqldumpslow で設定可能なオプション

ではコマンドを実行する際に指定できる有用なプションを以下にまとめる。

- `-s <sort_type>`
  - 出力結果をどのようにソートさせるのか指定する
  - 指定可能な値は以下になる
    - `t,at`: クエリの実行時間、あるいは平均時間でソート
    - `l,al`: ロック時間、あるいは平均ロック時間でソート
    - `r,ar`: 抽出した行数でソート
    - `c`: クエリのカウント数でソート（頻度が高い順）
  - なおデフォルトでは `-s at` であり、クエリの実行時間でソートしている

なお課題1で実行したクエリを記録したスロークエリログを使用する場合、ロック時間が短いため、ロック時間によるソートだと全て `Lock=0.00s (0s)` と表示される。

これらのコマンドはユースケースに応じて以下のように指定することができる。

```bash
# 最も頻度が高くスロークエリに現れるクエリ
> mysqldumpslow -s c -t 1 /var/lib/mysql/slow_query.log

# 実行時間が最も長いクエリ
> mysqldumpslow -s at -t 1 /var/lib/mysql/slow_query.log

# ロック時間が最も長いクエリ
> mysqldumpslow -s al -t 1 /var/lib/mysql/slow_query.log
```
