# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

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
  
  ```bash
  mysql> set global slow_query_log=1;
  mysql> set global long_query_time=0.1;
  mysql> set global slow_query_log_file ='/var/lib/mysql/slow_query.log';
  ```

- 設定ファイル
  - Dockerコンテナを使用している場合は、カスタム設定を `/etc/mysql/conf.d/` 以下のファイルに追加すればいい

    ```bash
    [mysqld]
    slow_query_log=1
    long_query_time=1
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
