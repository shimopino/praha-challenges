# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

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

ではコマンドを実行する際に指定できるオプションを以下にまとめる。


