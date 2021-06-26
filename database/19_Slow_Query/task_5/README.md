# クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

実務ではスロークエリを直接確認するよりも、Percona社が提供している `pt-query-digest` のようなツールを使用してローカルのログファイルを確認したり、クラウド上でアプリを稼働させている場合には `Datadog` を使用してクエリの解析を行ったりすることが多いらしい。

では実際に Percona社が提供している `pt-query-digest` をインストールして、スロークエリログを表示させてみましょう。

参考資料

- [Configuring Percona Repositories with percona-release](https://www.percona.com/doc/percona-repo-config/percona-release.html#debian-and-ubuntu)
- [Installing Percona Toolkit](https://www.percona.com/doc/percona-toolkit/LATEST/installation.html)

<details>
<summary>回答例</summary>

参考資料に載せている通りの手順で導入できる。

```bash
# Dockerコンテナ上で実行する
> apt update
> apt install -y wget gnupg2 lsb-release curl
> wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
> dpkg -i percona-release_latest.generic_all.deb
> apt update
> apt install install percona-toolkit
```

以下のようにスロークエリに記載されているログの統計情報などを理解しやすい形で表示してくれる。

```bash
$ pt-query-digest /var/lib/mysql/slow_query.log

# 110ms user time, 0 system time, 14.00k rss, 17.00k vsz
# Current date: Wed Apr 14 17:05:37 2021
# Hostname: 06e379580806
# Files: /var/lib/mysql/slow_query.log
# Overall: 25 total, 17 unique, 0.01 QPS, 0.02x concurrency ______________
# Time range: 2021-04-14T15:53:01 to 2021-04-14T16:42:41
# Attribute          total     min     max     avg     95%  stddev  median
# ============     ======= ======= ======= ======= ======= ======= =======
# Exec time            49s   191ms     18s      2s      5s      3s   740ms
# Lock time            6ms    99us   484us   254us   445us   105us   204us
# Rows sent         10.65M       3   4.42M 436.37k   2.37M   1.03M    6.98
# Rows examine      61.31M 319.54k   5.27M   2.45M   3.03M   1.33M   2.88M
# Query size         6.78k      27     471  277.60  463.90  111.57  299.03

# Profile
# Rank Query ID                            Response time Calls R/Call V/M 
# ==== =================================== ============= ===== ====== ====
#    1 0x307F123E447EAB2848AE5708CC8E152D  19.6572 40.3%     4 4.9143 11.12 SELECT salaries
#    2 0x6B7B9FD131FB20B8BF51EBE86B149B29   6.2802 12.9%     1 6.2802  0.00 SELECT employees titles salaries
#    3 0x2F84430BDC9142C1CD7BBA854E85E874   5.5629 11.4%     3 1.8543  2.72 SELECT salaries employees
#    4 0xF2DB8C9B56B7DC29403E4DDB6FC40BFB   4.1989  8.6%     3 1.3996  0.00 SELECT employees titles salaries
#    5 0x230DC4D0558125A2DE67D9DA5224C3E5   2.4722  5.1%     1 2.4722  0.00 SELECT employees titles salaries
#    6 0x146C8E31E1F9E0C9623D01F9DE1F2C2C   2.2069  4.5%     1 2.2069  0.00 SELECT employees titles salaries
#    7 0x2F4296670E38DF246981333B4DF1C3A1   1.5609  3.2%     2 0.7804  0.00 SELECT employees dept_emp departments
#    8 0x684D196378A495DFD45E1DDBEEBE5660   1.2141  2.5%     1 1.2141  0.00 SELECT employees titles salaries
#    9 0x8DCB490F51CA2B4983FA1CB91F69B453   1.1343  2.3%     1 1.1343  0.00 SELECT employees titles salaries
#   10 0x6627C94BDEE1AB5DA4A0D0C9B38F8F20   1.0775  2.2%     1 1.0775  0.00 SELECT employees titles salaries
#   11 0x92826BE17649514DDB38586FF8AEB737   0.6067  1.2%     1 0.6067  0.00 SELECT salaries
#   12 0x19A5B7015A2E7977DEA3DABEDA643BFB   0.5623  1.2%     1 0.5623  0.00 SELECT salaries
# MISC 0xMISC                               2.2673  4.6%     5 0.4535   0.0 <5 ITEMS>

# Query 1: 0.00 QPS, 0.01x concurrency, ID 0x307F123E447EAB2848AE5708CC8E152D at byte 6633
# This item is included in the report because it matches --limit.
# Scores: V/M = 11.12
# Time range: 2021-04-14T15:58:42 to 2021-04-14T16:28:46
# Attribute    pct   total     min     max     avg     95%  stddev  median
# ============ === ======= ======= ======= ======= ======= ======= =======
# Count         16       4
# Exec time     40     20s   563ms     18s      5s     18s      7s      9s
# Lock time     11   731us   153us   205us   182us   204us    18us   194us
# Rows sent      0      16       4       4       4       4       0       4
# Rows examine  15   9.28M 469.00k   2.94M   2.32M   2.88M   1.05M   2.88M
# Query size    17   1.20k     307     307     307     307       0     307
# String:
# Hosts        localhost
# Users        root
# Query_time distribution
#   1us
#  10us
# 100us
#   1ms
#  10ms
# 100ms  ################################################################
#    1s
#  10s+  #####################
# Tables
#    SHOW TABLE STATUS LIKE 'salaries'\G
#    SHOW CREATE TABLE `salaries`\G
# EXPLAIN /*!50100 PARTITIONS*/
SELECT
    CASE 
    WHEN salary <= 50000  THEN 'low'
    WHEN salary <= 100000 THEN 'middle'
    WHEN salary <= 150000 THEN 'middle_high'
    ELSE 'high'
    END AS salary_class
   ,COUNT(DISTINCT emp_no) AS emp_count
FROM salaries
WHERE to_date = '9999-01-01'
GROUP BY salary_class
ORDER BY emp_count DESC\G
```

</details>

## #2 クイズ

生のスロークエリログには以下のような値が出力されている。

```bash
# Time: 2021-04-14T16:04:50.500480Z
# User@Host: root[root] @ localhost []  Id:    24
# Query_time: 1.495217  Lock_time: 0.000264 Rows_sent: 7  Rows_examined: 3208169
```

この中で `Rows_sent` と `Rows_examined` の違いは何か、またクエリを高速化させる観点ではどの値がどのようになることを気にする必要があるでしょうか。

<details>
<summary>回答例</summary>
<div>

- `Rows_sent`
  - クライアントに対して送り返す行数
- `Rows_examined`
  - クライアントに送り返す行を探索するために読み込んだ行数

`Rows_examined` が多い場合は実行速度が遅い場合が多いらしいので注意が必要である。高速化にはインデックスなどを使用できる。

参考資料

- [MySQLのクエリの良し悪しはrows_examinedで判断する](https://blog.kamipo.net/entry/2018/03/22/084126)

</div>
</details>
