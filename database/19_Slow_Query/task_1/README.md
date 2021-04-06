# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [スロークエリの有効化](#%E3%82%B9%E3%83%AD%E3%83%BC%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96)
- [0.1秒未満のクエリを実行する](#01%E7%A7%92%E6%9C%AA%E6%BA%80%E3%81%AE%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B)
- [0.1秒以上かかるクエリを実行する](#01%E7%A7%92%E4%BB%A5%E4%B8%8A%E3%81%8B%E3%81%8B%E3%82%8B%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スロークエリの有効化

スロークエリログを有効化する前に、Dockerコンテナを起動した段階でのデフォルト設定を載せておく。

デフォルト設定のままではスロークエリログは出力されないようになっている。

```bash
mysql> show variables like '%slow%';
+---------------------------+--------------------------------------+
| Variable_name             | Value                                |
+---------------------------+--------------------------------------+
| log_slow_admin_statements | OFF                                  |
| log_slow_extra            | OFF                                  |
| log_slow_slave_statements | OFF                                  |
| slow_launch_time          | 2                                    |
| slow_query_log            | OFF                                  |
| slow_query_log_file       | /var/lib/mysql/f080c363072e-slow.log |
+---------------------------+--------------------------------------+
```

では実行に0.1秒以上かかったクエリを、スロークエリログとして記録するように設定を変更する。

なおその際にはコマンドラインからへ変更する方法と、設定ファイルを変更する方法が存在する。

- コマンドライン
  - コマンドラインからは `global` をつけることでサーバーを再起動する必要はなくなる
  - 以下のうち `log_queries_not_using_indexes` を設定することで、インデックスを使用していないクエリも記録できるが、今回は時間計測のみを行う
  
    ```bash
    mysql> set global slow_query_log=1;
    mysql> set global long_query_time=0.1;
    # mysql> set global log_queries_not_using_indexes=1;
    mysql> set global slow_query_log_file ='/var/lib/mysql/slow_query.log';
    ```

- 設定ファイル
  - Dockerコンテナを使用している場合は、カスタム設定を `/etc/mysql/conf.d/` 以下のファイルに追加すればいい

    ```bash
    [mysqld]
    slow_query_log=1
    long_query_time=1
    # log_queries_not_using_indexes=1
    slow_query_log_file=/tmp/mysql/slow_query.log
    ```

  - 設定ファイルに記述した場合にはMySQLサーバを再起動する必要がある

    ```bash
    > service mysqld restart
    ```

再度設定を確認すると以下のようになっており、スロークエリログが有効化されていることと、実行時間が0.1秒以上のクエリを対象としていることがわかる。

```bash
mysql> show variables like '%slow%';
+---------------------------+-------------------------------+
| Variable_name             | Value                         |
+---------------------------+-------------------------------+
| log_slow_admin_statements | OFF                           |
| log_slow_extra            | OFF                           |
| log_slow_slave_statements | OFF                           |
| slow_launch_time          | 2                             |
| slow_query_log            | ON                            |
| slow_query_log_file       | /var/lib/mysql/slow_query.log |
+---------------------------+-------------------------------+

mysql> show variables like '%long%';
+----------------------------------------------------------+----------+
| Variable_name                                            | Value    |
+----------------------------------------------------------+----------+
| long_query_time                                          | 0.100000 |
| performance_schema_events_stages_history_long_size       | 10000    |
| performance_schema_events_statements_history_long_size   | 10000    |
| performance_schema_events_transactions_history_long_size | 10000    |
| performance_schema_events_waits_history_long_size        | 10000    |
+----------------------------------------------------------+----------+
```

## 0.1秒未満のクエリを実行する

過去の課題から0.1秒未満の実行時間であったクエリを実行する。

クエリその1（実行時間は `0.0337` 秒）

```sql
SELECT hire_date
FROM employees
WHERE hire_date = '1990-01-01';
```

クエリその2（実行時間は `0.0626` 秒）

```sql
SELECT hire_date 
FROM employees 
WHERE hire_date > '1990-01-01'
GROUP BY hire_date;
```

クエリその3（実行時間は `0.0432` 秒）

```sql
SELECT hire_date 
FROM employees 
WHERE MONTH(hire_date) = '12';
```

スロークエリログを確認すると何も出力されていないことがわかる。

```bash
> cat /var/lib/mysql/slow_query.log 
/usr/sbin/mysqld, Version: 8.0.23 (MySQL Community Server - GPL). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
```

## 0.1秒以上かかるクエリを実行する

クエリその1（実行時間は `0.8167` 秒）

> 部署ごとに男性従業員と女性従業員の人数を産出する

```sql
SELECT departments.dept_no
      ,MIN(dept_name)
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS MAN_COUNT
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS FEMALE_COUNT
FROM employees
INNER JOIN dept_emp ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
GROUP BY dept_emp.dept_no;
```

クエリその2（実行時間は `1.3569` 秒）

> 以下の給料レンジごとに、従業員の人数を算出する

```bash
# 給料レンジ
     0 <=         low <=  50000
 50000 <       middle <= 100000
100000 <  middle_high <= 150000
150000 <         high
```

クエリは以下になる。

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

クエリその3（実行時間は `4.5868` 秒）

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

スロークエリログを確認すると各クエリに関して、実行時間や走査した行数が乗っていることがわかる。

```bash
> cat /var/lib/mysql/slow_query.log 

/usr/sbin/mysqld, Version: 8.0.23 (MySQL Community Server - GPL). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
# Time: 2021-04-06T16:44:12.098414Z
# User@Host: root[root] @ localhost []  Id:   129
# Query_time: 0.781388  Lock_time: 0.000256 Rows_sent: 9  Rows_examined: 663215
use employees;
SET timestamp=1617727451;
SELECT departments.dept_no
      ,MIN(dept_name)
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS MAN_COUNT
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS FEMALE_COUNT
FROM employees
INNER JOIN dept_emp ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
GROUP BY dept_emp.dept_no;
# Time: 2021-04-06T16:45:03.899634Z
# User@Host: root[root] @ localhost []  Id:   129
# Query_time: 1.622969  Lock_time: 0.000159 Rows_sent: 4  Rows_examined: 5688098
SET timestamp=1617727502;
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
# Time: 2021-04-06T16:45:12.816048Z
# User@Host: root[root] @ localhost []  Id:   129
# Query_time: 4.409763  Lock_time: 0.000239 Rows_sent: 7  Rows_examined: 5381849
SET timestamp=1617727508;
SELECT title
      ,MIN(salary) AS Minimum
      ,ROUND(SUM(salary) / COUNT(salary)) AS Mean
      ,MAX(salary) As Maximum
FROM employees
INNER JOIN titles ON titles.emp_no = employees.emp_no
INNER JOIN salaries ON salaries.emp_no = employees.emp_no
GROUP BY title;
```

> performance_schema と異なり初期ロックの時間は計測されておらず、クエリを実行して全てのロックが解放されるまでの時間を計測しているため、解釈に注意にする必要あり。
