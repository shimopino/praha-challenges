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

また高速のためにインデックスを使用してみましょう。

<details>
<summary>回答例</summary>

```sql
SELECT hire_date
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS COUNT_MAN
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS COUNT_FEMALE
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) / COUNT(*) AS RATE_MAN
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) / COUNT(*) AS RATE_FEMALE
FROM employees
GROUP BY hire_date;
```

</details>


## #2 クイズ

30歳のときに雇われた従業員に関して以下の情報を表示させてみましょう。

- `hire_date`
- `birth_date`
- `first_name`
- `last_name`

また高速化のためにインデックスを利用できるのか考えてみましょう。

<details>
<summary>回答例</summary>

```sql
SELECT hire_date, birth_date, first_name, last_name
FROM employees
WHERE FLOOR(DATEDIFF(hire_date, birth_date)/365) = 30;
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
SELECT SUM(next_emp_no - base_emp_np)
FROM (
    SELECT emp_no AS base_emp_no
          ,emp_no OVER (
              ORDER BY emp_no
              ROWS BETWEEN 1 FOLLOWING AND 1 FOLLOWING
          ) AS next_emp_no
    FROM employees
);
```

</details>
