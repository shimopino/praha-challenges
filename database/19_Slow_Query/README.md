# 課題19「スロークエリを理解する」

<!-- START doctoc -->
<!-- END doctoc -->

## 課題1

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

