# 複雑なクエリでの性能比較

<!-- START doctoc -->
<!-- END doctoc -->

## 調査対象クエリ

各年での雇用した従業員数の推移を表示する複雑なクエリを発行する。

```sql
SELECT YP1.HIRE_YEAR AS BASE_YEAR
      ,YP2.HIRE_YEAR AS NEXT_YEAR
      ,YP1.NEW_EMPLOYEES AS BASE_EMPLOYEES
      ,YP2.NEW_EMPLOYEES AS NEXT_EMPLOYEES
      ,YP2.NEW_EMPLOYEES / YP1.NEW_EMPLOYEES AS GROWTH_RATE
FROM (
    SELECT YEAR(hire_date) AS HIRE_YEAR
          ,COUNT(hire_date) AS NEW_EMPLOYEES 
    FROM employees
    GROUP BY HIRE_YEAR
) YP1
INNER JOIN (
    SELECT YEAR(hire_date) AS HIRE_YEAR
          ,COUNT(hire_date) AS NEW_EMPLOYEES 
    FROM employees
    GROUP BY HIRE_YEAR
) YP2
ON YP1.HIRE_YEAR = YP2.HIRE_YEAR - 1;
```

なおMySQL8.0では以下のようなクエリで実行できる。

```sql
WITH
HIRE_YEAR_SUMMARY AS (
    SELECT YEAR(hire_date) AS HIRE_YEAR
          ,COUNT(hire_date) AS NEW_EMPLOYEES 
    FROM employees
    GROUP BY HIRE_YEAR
)
SELECT YP1.HIRE_YEAR AS BASE_YEAR
      ,YP2.HIRE_YEAR AS NEXT_YEAR
      ,YP1.NEW_EMPLOYEES AS BASE_EMPLOYEES
      ,YP2.NEW_EMPLOYEES AS NEXT_EMPLOYEES
      ,YP2.NEW_EMPLOYEES / YP1.NEW_EMPLOYEES AS GROWTH_RATE
FROM HIRE_YEAR_SUMMARY YP1
INNER JOIN HIRE_YEAR_SUMMARY YP2
ON YP1.HIRE_YEAR = YP2.HIRE_YEAR - 1;
```

出力結果は以下のようになる。

```bash
+-----------+-----------+----------------+----------------+-------------+
| BASE_YEAR | NEXT_YEAR | BASE_EMPLOYEES | NEXT_EMPLOYEES | GROWTH_RATE |
+-----------+-----------+----------------+----------------+-------------+
|      1985 |      1986 |          35316 |          36150 |      1.0236 |
|      1986 |      1987 |          36150 |          33501 |      0.9267 |
|      1987 |      1988 |          33501 |          31436 |      0.9384 |
|      1988 |      1989 |          31436 |          28394 |      0.9032 |
|      1989 |      1990 |          28394 |          25610 |      0.9020 |
|      1990 |      1991 |          25610 |          22568 |      0.8812 |
|      1991 |      1992 |          22568 |          20402 |      0.9040 |
|      1992 |      1993 |          20402 |          17772 |      0.8711 |
|      1993 |      1994 |          17772 |          14835 |      0.8347 |
|      1994 |      1995 |          14835 |          12115 |      0.8166 |
|      1995 |      1996 |          12115 |           9574 |      0.7903 |
|      1996 |      1997 |           9574 |           6669 |      0.6966 |
|      1997 |      1998 |           6669 |           4155 |      0.6230 |
|      1998 |      1999 |           4155 |           1514 |      0.3644 |
|      1999 |      2000 |           1514 |             13 |      0.0086 |
+-----------+-----------+----------------+----------------+-------------+
```

## 比較結果

インデックスなしのときの実行計画は以下になる。

```bash
+----+-------------+------------+------------+------+---------------+-------------+---------+------+--------+----------+-----------------+
| id | select_type | table      | partitions | type | possible_keys | key         | key_len | ref  | rows   | filtered | Extra           |
+----+-------------+------------+------------+------+---------------+-------------+---------+------+--------+----------+-----------------+
|  1 | PRIMARY     | <derived2> | NULL       | ALL  | NULL          | NULL        | NULL    | NULL | 298980 |   100.00 | NULL            |
|  1 | PRIMARY     | <derived2> | NULL       | ref  | <auto_key0>   | <auto_key0> | 5       | func |     10 |   100.00 | Using where     |
|  2 | DERIVED     | employees  | NULL       | ALL  | NULL          | NULL        | NULL    | NULL | 298980 |   100.00 | Using temporary |
+----+-------------+------------+------------+------+---------------+-------------+---------+------+--------+----------+-----------------+
```

インデックスありのときの実行計画は以下になる。

```bash
+----+-------------+------------+------------+-------+---------------+---------------+---------+------+--------+----------+------------------------------+
| id | select_type | table      | partitions | type  | possible_keys | key           | key_len | ref  | rows   | filtered | Extra                        |
+----+-------------+------------+------------+-------+---------------+---------------+---------+------+--------+----------+------------------------------+
|  1 | PRIMARY     | <derived2> | NULL       | ALL   | NULL          | NULL          | NULL    | NULL | 298980 |   100.00 | NULL                         |
|  1 | PRIMARY     | <derived2> | NULL       | ref   | <auto_key0>   | <auto_key0>   | 5       | func |     10 |   100.00 | Using where                  |
|  2 | DERIVED     | employees  | NULL       | index | hire_date_idx | hire_date_idx | 3       | NULL | 298980 |   100.00 | Using index; Using temporary |
+----+-------------+------------+------------+-------+---------------+---------------+---------+------+--------+----------+------------------------------+
```

計測した時間にはあまり変化はない（多少は高速化している？）。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          | w/o index| w/ index |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0002 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0001 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0715 |   0.0686 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
```

