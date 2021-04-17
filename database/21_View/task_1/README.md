# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

## ビューとは何か

`View` は定義したクエリをもとに、テーブルが存在しているかのような仮想的なテーブルを定義できる機能である。

例えば `employees` テーブルは以下のように定義されているが、主キーと `first_name` と `last_name` を有するような仮想的なテーブルを作成することができる。

```bash
mysql> desc employees;
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int           | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   |     | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   |     | NULL    |       |
+------------+---------------+------+-----+---------+-------+
```

実際に `employees_view` テーブルを作成する。

```sql
CREATE VIEW employees_view AS SELECT emp_no, first_name, last_name FROM employees;
```

データベースに存在しているテーブルを確認すると、作成したビューが登録されていることがわかる。

```bash
mysql> SHOW TABLES;
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| employees_view       | # <-- here
| salaries             |
| titles               |
+----------------------+
```

作成されたビューに対しては、テーブルと同じようにクエリを使ってデータを抽出することが可能である。

```bash
mysql> SELECT * FROM employees_view LIMIT 5;
+--------+------------+-----------+
| emp_no | first_name | last_name |
+--------+------------+-----------+
|  10001 | Georgi     | Facello   |
|  10002 | Bezalel    | Simmel    |
|  10003 | Parto      | Bamford   |
|  10004 | Chirstian  | Koblick   |
|  10005 | Kyoichi    | Maliniak  |
+--------+------------+-----------+
```

またビューの削除や定義変更も可能である。

```sql
-- 定義の変更
ALTER VIEW employees_view AS SELECT emp_no, birth_date, first_name FROM employees;

-- ビューの削除
DROP VIEW employees_view;
```

また作成したビューに関する情報は `INFORMATION_SCHEMA` の `VIEWS` に格納されているため、以下のように参照することも可能である。

```bash
mysql> SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE table_schema LIKE '%employees%'\G
*************************** 1. row ***************************
       TABLE_CATALOG: def
        TABLE_SCHEMA: employees
          TABLE_NAME: current_dept_emp
     VIEW_DEFINITION: select `employees`.`l`.`emp_no` AS `emp_no`,`d`.`dept_no` AS `dept_no`,`employees`.`l`.`from_date` AS `from_date`,`employees`.`l`.`to_date` AS `to_date` from (`employees`.`dept_emp` `d` join `employees`.`dept_emp_latest_date` `l` on(((`d`.`emp_no` = `employees`.`l`.`emp_no`) and (`d`.`from_date` = `employees`.`l`.`from_date`) and (`employees`.`l`.`to_date` = `d`.`to_date`))))
        CHECK_OPTION: NONE
        IS_UPDATABLE: YES
             DEFINER: root@localhost
       SECURITY_TYPE: DEFINER
CHARACTER_SET_CLIENT: latin1
COLLATION_CONNECTION: latin1_swedish_ci
*************************** 2. row ***************************
       TABLE_CATALOG: def
        TABLE_SCHEMA: employees
          TABLE_NAME: dept_emp_latest_date
     VIEW_DEFINITION: select `employees`.`dept_emp`.`emp_no` AS `emp_no`,max(`employees`.`dept_emp`.`from_date`) AS `from_date`,max(`employees`.`dept_emp`.`to_date`) AS `to_date` from `employees`.`dept_emp` group by `employees`.`dept_emp`.`emp_no`
        CHECK_OPTION: NONE
        IS_UPDATABLE: NO
             DEFINER: root@localhost
       SECURITY_TYPE: DEFINER
CHARACTER_SET_CLIENT: latin1
COLLATION_CONNECTION: latin1_swedish_ci
*************************** 3. row ***************************
       TABLE_CATALOG: def
        TABLE_SCHEMA: employees
          TABLE_NAME: employees_view
     VIEW_DEFINITION: select `employees`.`employees`.`emp_no` AS `emp_no`,`employees`.`employees`.`first_name` AS `first_name`,`employees`.`employees`.`last_name` AS `last_name` from `employees`.`employees`
        CHECK_OPTION: NONE
        IS_UPDATABLE: YES
             DEFINER: root@localhost
       SECURITY_TYPE: DEFINER
CHARACTER_SET_CLIENT: latin1
COLLATION_CONNECTION: latin1_swedish_ci
```

なおデータベースの初期化の際にすでにいくつかのビューが登録されていることがわかる。

## ビューのメリット

- 必要最低限のカラムのみを表示できる
- 個人情報や機密情報を含むカラムを表示させないようにできる 
- 結合や集約を多用している処理を再利用することで、後続の開発者での理解が容易となる
- 

参考資料

- [第58回　viewの使いどころを考えてみよう](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0058)

## Materialzed Viewとは何か
