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