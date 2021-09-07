# MySQL8.0での演習の準備

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [MySQL5.7の環境を用意する](#mysql57%E3%81%AE%E7%92%B0%E5%A2%83%E3%82%92%E7%94%A8%E6%84%8F%E3%81%99%E3%82%8B)
- [MySQL8.0の環境を用意する](#mysql80%E3%81%AE%E7%92%B0%E5%A2%83%E3%82%92%E7%94%A8%E6%84%8F%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## MySQL5.7の環境を用意する

練習用に [https://hub.docker.com/r/genschsa/mysql-employees](https://hub.docker.com/r/genschsa/mysql-employees) を使用する。

まずはDockerコンテナを起動する。

```bash
# Volumeはルートディレクトリ直下に変更
docker run -d \
  --rm \
  --name mysql-employees \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=college \
  -v /data:/var/lib/mysql \
  genschsa/mysql-employees
```

あとはコンテナ内にアクセスして以下のコマンドを実行すれば、MySQLにアクセスすることが可能となる。

```bash
> mysql -u root -pcollege
```

なお使用しているMySQLのバージョンは以下のように `5.7.24` になっている。

```bash
> mysql -V
>>
mysql  Ver 14.14 Distrib 5.7.24, for Linux (x86_64) using  EditLine wrapper
```

初期状態では以下のデータベースが作成されている。

```bash
mysql> SHOW DATABASES;
>>
+--------------------+
| Database           |
+--------------------+
| information_schema |
| employees          |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

演習で使用する `employees` データベースには、以下のテーブルが初期状態で作成されている。

```bash
mysql> USE employees;
>>
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed


mysql> show tables;
>>
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| salaries             |
| titles               |
| v_full_departments   |
| v_full_employees     |
+----------------------+
```

演習で使用する `employees` テーブルの定義は以下のようになっている。

```bash
mysql> desc employees
>>
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int(11)       | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   |     | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   |     | NULL    |       |
+------------+---------------+------+-----+---------+-------+
```

## MySQL8.0の環境を用意する

`mysql:8.0`のDockerイメージのコンテナインスタンスを起動した後で、コンテナに接続して以下のコマンドを実行すれば今回の演習で使用する環境を整えることができる。

```bash
# 演習用のスクリプトを実行するためのツールをインストール
apt-get update && apt-get install -y wget unzip

# 演習用のスクリプトをダウンロードする
wget https://github.com/datacharmer/test_db/archive/refs/heads/master.zip

# unzipしてからスクリプトを実行する
unzip test_db-master
cd test_db-master/
mysql -uroot -pcollege < ./employees.sql
```

これでMySQLのコンテナ環境に演習で使用するデータを準備できる。