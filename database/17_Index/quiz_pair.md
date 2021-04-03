# ペアのクイズ

<!-- START doctoc -->
<!-- END doctoc -->

## クイズ1

> 2000年以降に入社した男性社員と女性社員の内訳を求めるクエリと、それを高速化するようなインデックスを作成してください。

クエリ

```sql
SELECT SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) / COUNT(*) AS MEN_RATE
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) / COUNT(*) AS FEMALE_RATE
FROM employees
WHERE hire_date >= '2000-01-01';
```

mysql> show indexes from employees\G
*************************** 1. row ***************************
        Table: employees
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: emp_no
    Collation: A
  Cardinality: 298980
     Sub_part: NULL
       Packed: NULL
         Null: 
   Index_type: BTREE
      Comment: 
Index_comment: 
      Visible: YES
   Expression: NULL

高速化のためのインデックス

```sql
-- まずはインデックスを作成する
CREATE INDEX hire_date_idx ON employees (hire_date);
```

*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298980
     filtered: 33.33
        Extra: Using where

+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0368 |   0.0000 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
|                                                |   0.0371 |   0.0000 |
+------------------------------------------------+----------+----------+


mysql> show indexes from employees\G
*************************** 1. row ***************************
        Table: employees
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: emp_no
    Collation: A
  Cardinality: 298980
     Sub_part: NULL
       Packed: NULL
         Null: 
   Index_type: BTREE
      Comment: 
Index_comment: 
      Visible: YES
   Expression: NULL
*************************** 2. row ***************************
        Table: employees
   Non_unique: 1
     Key_name: hire_date_idx
 Seq_in_index: 1
  Column_name: hire_date
    Collation: A
  Cardinality: 4747
     Sub_part: NULL
       Packed: NULL
         Null: 
   Index_type: BTREE
      Comment: 
Index_comment: 
      Visible: YES
   Expression: NULL



*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: range
possible_keys: hire_date_idx
          key: hire_date_idx
      key_len: 3
          ref: NULL
         rows: 13
     filtered: 100.00
        Extra: Using index condition


+------------------------------------------------+----------+  
| Stage                                          | Duration |  
+------------------------------------------------+----------+  
| stage/sql/starting                             |   0.0000 |  
| stage/sql/Executing hook on transaction begin. |   0.0000 |  
| stage/sql/starting                             |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |
| stage/sql/init                                 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |
| stage/sql/statistics                           |   0.0000 |
| stage/sql/preparing                            |   0.0000 |
| stage/sql/executing                            |   0.0000 |
| stage/sql/end                                  |   0.0000 |
| stage/sql/query end                            |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |
+------------------------------------------------+----------+

## クイズ2

> 1965年以降生まれの社員に最も多いラストネームは何か求めるクエリと、それを高速化するようなインデックスを作成してください。

クエリ

```sql
SELECT last_name, COUNT(*) AS LAST_NAME_COUNT
FROM employees
WHERE birth_date >= '1965-01-01'
GROUP BY last_name
ORDER BY LAST_NAME_COUNT DESC
LIMIT 1;
```

高速化のためのインデックス

```sql
CREATE INDEX birth_date_idx ON employees (birth_date);
CREATE INDEX last_name_idx ON employees (last_name)
```

*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: employees
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 298980
     filtered: 33.33
        Extra: Using where; Using temporary; Using filesort


0.0475


+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0000 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0473 |   0.0044 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
|                                                |   0.0475 |   0.0047 |
+------------------------------------------------+----------+----------+





+------------------------------------------------+----------+
| Stage                                          | Duration |
+------------------------------------------------+----------+
| stage/sql/starting                             |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |
| stage/sql/starting                             |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |
| stage/sql/init                                 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |
| stage/sql/statistics                           |   0.0000 |
| stage/sql/preparing                            |   0.0000 |
| stage/sql/Creating tmp table                   |   0.0000 |
| stage/sql/executing                            |   0.0044 |
| stage/sql/end                                  |   0.0000 |
| stage/sql/query end                            |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |
| stage/sql/removing tmp table                   |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |
+------------------------------------------------+----------+

## クイズ3

```sql
SELECT COUNT(*)
FROM employees
WHERE first_name LIKE 'Ann%';
```

```sql
CREATE INDEX first_name_idx ON employees (first_name);
```

0.0405

+------------------------------------------------+----------+----------+
| Stage                                          | Duration | Duration |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.0402 |   0.0001 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
|                                                |   0.0405 |   0.0003 |
+------------------------------------------------+----------+----------+


0.0003

+------------------------------------------------+----------+
| Stage                                          | Duration |
+------------------------------------------------+----------+
| stage/sql/starting                             |   0.0000 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |
| stage/sql/starting                             |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |
| stage/sql/init                                 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |
| stage/sql/statistics                           |   0.0000 |
| stage/sql/preparing                            |   0.0000 |
| stage/sql/executing                            |   0.0001 |
| stage/sql/end                                  |   0.0000 |
| stage/sql/query end                            |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |
+------------------------------------------------+----------+
