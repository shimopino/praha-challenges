# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [ビューとは何か](#%E3%83%93%E3%83%A5%E3%83%BC%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [ビューのメリット](#%E3%83%93%E3%83%A5%E3%83%BC%E3%81%AE%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88)
  - [SQLをよりシンプルに書ける](#sql%E3%82%92%E3%82%88%E3%82%8A%E3%82%B7%E3%83%B3%E3%83%97%E3%83%AB%E3%81%AB%E6%9B%B8%E3%81%91%E3%82%8B)
  - [よりセキュアなクエリを強制する](#%E3%82%88%E3%82%8A%E3%82%BB%E3%82%AD%E3%83%A5%E3%82%A2%E3%81%AA%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%E5%BC%B7%E5%88%B6%E3%81%99%E3%82%8B)
- [Materialzed Viewとは何か](#materialzed-view%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
CREATE VIEW employees_view AS
SELECT emp_no, first_name, last_name FROM employees;
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
ALTER VIEW employees_view AS
SELECT emp_no, birth_date, first_name FROM employees;

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

### SQLをよりシンプルに書ける

> 部署ごとに男性従業員と女性従業員の人数を算出する。

ビューを使用する前は以下のようなクエリを実行していた。

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

ここでは従業員と部署の紐づけテーブルから `to_date` が最大値であるレコードを抽出した後で、従業員テーブルと部署テーブルを結合しており、一見してはわかりずらいクエリとなってしまっている。

上記のクエリであれば、部署IDに紐づいている従業員のテーブルを事前に用意することができていれば、結合処理などを省くことができ簡略化させることができる。

そこで以下のビューを作成する。

```sql
CREATE VIEW dept_emp_info AS 
SELECT departments.dept_no
      ,departments.dept_name
      ,dept_emp.emp_no
      ,gender
FROM employees
INNER JOIN (
    SELECT emp_no
          ,MAX(dept_no) AS dept_no
          ,MAX(from_date) AS from_date
          ,MAX(to_date) AS to_date
     FROM dept_emp
     GROUP BY emp_no
) AS dept_emp ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no;
```

これでそれぞれの部署に所属している従業員とその性別を結合させたビューを作成することができている。

```bash
mysql> desc dept_emp_info;
+-----------+---------------+------+-----+---------+-------+
| Field     | Type          | Null | Key | Default | Extra |
+-----------+---------------+------+-----+---------+-------+
| dept_no   | char(4)       | NO   |     | NULL    |       |
| dept_name | varchar(40)   | NO   |     | NULL    |       |
| emp_no    | int           | NO   |     | NULL    |       |
| gender    | enum('M','F') | NO   |     | NULL    |       |
+-----------+---------------+------+-----+---------+-------+
```

このビューを使用すれば、部署ごとの男性従業員と女性従業員の人数を算出するクエリは以下のように変更することができる。


```sql
SELECT dept_no
      ,MAX(dept_name)
      ,SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS MAN_COUNT
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS FEMALE_COUNT
FROM dept_emp_info
GROUP BY dept_no;
```

### よりセキュアなクエリを強制する

テーブルで定義しているカラムには、個人情報や機密情報など、公開をしたくないカラムが存在している場合がある。

このときにビューを作成してもともとのテーブルから公開可能な部分だけを取り出し、アクセス制御を書けることで参照できるユーザを特定し、情報が不用意に漏洩することを防止することができる。

例えば以下のクエリでは、全てのカラムを抽出するクエリになっているが、元の `employees` テーブルから公開可能なカラムのみをビューで取り出しているため、非公開にしたいカラムにはアクセスされることはない。

```bash
mysql> SELECT * FROM employees_view LIMIT 10;
+--------+------------+-----------+
| emp_no | first_name | last_name |
+--------+------------+-----------+
|  10001 | Georgi     | Facello   |
|  10002 | Bezalel    | Simmel    |
|  10003 | Parto      | Bamford   |
|  10004 | Chirstian  | Koblick   |
|  10005 | Kyoichi    | Maliniak  |
|  10006 | Anneke     | Preusig   |
|  10007 | Tzvetan    | Zielinski |
|  10008 | Saniya     | Kalloufi  |
|  10009 | Sumant     | Peac      |
|  10010 | Duangkaew  | Piveteau  |
+--------+------------+-----------+
```

参考資料

- [第58回　viewの使いどころを考えてみよう](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0058)

## Materialzed Viewとは何か

**マテリアライズドビュー** とは、事前に定義されたSQLの結果をテーブルとして保持しておくことで、参照ごとに再検索することなく、高速に結果を返すための仕組みである。

図解はMicrosoftが提供している [Materialized View pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view) が理解しやすかった。

![](https://docs.microsoft.com/en-us/azure/architecture/patterns/_images/materialized-view-pattern-diagram.png)

上記の図が示しているように、DB設計の際に行う非正規化などは、あくまでもデータの保存方法に着目しているため、本当に必要な形式となっていない場合がある。

そこで事前にビューを作成することでアプリに必要なフォーマットでデータを抽出することが可能となる。

[マテリアライズドビューを使用したパフォーマンスのチューニング](https://docs.microsoft.com/ja-jp/azure/synapse-analytics/sql-data-warehouse/performance-tuning-materialized-views) によると、以下のようなシナリオがあるらしい。

- サイズの大きなデータに対する複雑な分析クエリのパフォーマンスを高めたい
  - 複雑な分析クエリでは使用される集計関数やテーブルの結合が増える
  - これらの処理は計算負荷が高く、特に大きなテーブルでクエリの実行時間が延びる
  - マテリアライズドビューを使用することで、クエリの再計算が不要になる
  - 結果として計算コストが抑えられ、クエリの応答時間を短縮できる
- クエリへの変更をゼロ、または最小限に抑えつつパフォーマンスを向上させたい
  - マテリアライズドビューを作成することで、ベースのテーブルに対して実行されるクエリに影響は及ばない
  - クエリの中で直接参照しなくても、オプティマイザーによって自動的に選択される
  - つまり、パフォーマンスチューニングでクエリに変更を加える必要はない

> 分析用途ならマテリアライズドビューをわざわざ使用するよりも、本番用のDBとは別に分析用のDBにデータを保存しておけばいいような気もする

参考資料

- [マテリアライズドビュー](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%86%E3%83%AA%E3%82%A2%E3%83%A9%E3%82%A4%E3%82%BA%E3%83%89%E3%83%93%E3%83%A5%E3%83%BC)
- [3分でわかるマテリアライズド・ビュー -使い所と問題点を考える-](https://qiita.com/wanko5296/items/61c3e6ec4561b26beb5c)
- [Oracleの機能を使って表の結合を高速化する](https://www.atmarkit.co.jp/ait/articles/0504/21/news105.html)
- [[Oracle] 3 マテリアライズド・ビューの概要とアーキテクチャ](https://docs.oracle.com/cd/E57425_01/121/REPLN/repmview.htm#BABIIDJC)
- [[PostgreSQL] 38.3. マテリアライズドビュー](https://www.postgresql.jp/document/9.3/html/rules-materializedviews.html)
- [[Microsoft] Materialized View pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view)
- [[BigQuery] マテリアライズド ビューの概要](https://cloud.google.com/bigquery/docs/materialized-views-intro)
- [DBエンジンのトレンド](https://db-engines.com/en/ranking_trend)
