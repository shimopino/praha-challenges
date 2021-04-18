# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [クエリその1](#%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%9D%E3%81%AE1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## クエリその1

複合インデックスの課題で作成したクエリを利用する。

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

なお複合インデックスは事前に作成しておく。

```sql
CREATE INDEX hdate_gender_idx ON employees (hire_date, gender);
```

比較対象として以下のビューを作成した上で、`SELECT * FROM target_female` を実行する。

```sql
CREATE VIEW TARGET_FEMALE AS
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

ではインデックスを使用した場合と層ではない場合も含めて実行時間を比較していく。

### 比較結果

実行時間を比較したが、結果からわかるようにパフォーマンスには一切影響がなかった。

|           | w/o view   | w/  view   |
| :-------- | :--------- | :--------- |
| w/o index | 0.1549 [s] | 0.1518 [s] |
| w/  index | 0.0426 [s] | 0.0332 [s] |

これはビューを参照したとしても定義しているクエリは再実行されるため、ビューを使用しない場合と同じ処理が実行されるためである。

なお実行計画に関しても、ビューの使用有無にかかわらず変化はなかった。

```bash
# 複合インデックスを使用しない場合
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | PRIMARY     | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 298990 |     0.56 | Using where |
|  3 | SUBQUERY    | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 298990 |     5.56 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+

# 複合インデックスを使用する場合
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows  | filtered | Extra                              |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+------------------------------------+
|  1 | PRIMARY     | employees | NULL       | range | hdate_gender_idx | hdate_gender_idx | 4       | NULL | 49920 |     5.00 | Using index condition; Using where |
|  3 | SUBQUERY    | employees | NULL       | range | hdate_gender_idx | hdate_gender_idx | 4       | NULL | 49920 |    50.00 | Using index condition              |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+------------------------------------+
```

## クエリその2

念のため課題1で使用したクエリの実行時間を比較したが、あまり差はなかった。

| w/o view   | w/  view   |
| :--------- | :--------- |
| 0.9665 [s] | 0.8026 [s] |

> ほんの少しだけビューを使ったほうが実行時間が早いように思えるが気のせいかも...

ビューを使用しないクエリ

```sql
SELECT departments.dept_no
      ,MIN(dept_name)
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS MAN_COUNT
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS FEMALE_COUNT
FROM employees
INNER JOIN (
    SELECT emp_no
          ,MAX(dept_no) AS dept_no
          ,MAX(from_date) AS from_date
          ,MAX(to_date) AS to_date
     FROM dept_emp
     GROUP BY emp_no
) AS dept_emp ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
GROUP BY dept_emp.dept_no;
```

ビューを使ったクエリ

```sql
SELECT dept_no
      ,MAX(dept_name)
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS MAN_COUNT
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS FEMALE_COUNT
FROM dept_emp_info
GROUP BY dept_no;
```
