# クエリの性能計測

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [FAQ](#faq)
  - [Q1: SQL関数の実行時間を計測するにはどうすればいいでしょうか](#q1-sql%E9%96%A2%E6%95%B0%E3%81%AE%E5%AE%9F%E8%A1%8C%E6%99%82%E9%96%93%E3%82%92%E8%A8%88%E6%B8%AC%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%E3%81%A9%E3%81%86%E3%81%99%E3%82%8C%E3%81%B0%E3%81%84%E3%81%84%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
  - [Q2: MySQL公式でサポートしている負荷エミュレーションツールの mysqlslap はどのように使えるでしょうか](#q2-mysql%E5%85%AC%E5%BC%8F%E3%81%A7%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E8%B2%A0%E8%8D%B7%E3%82%A8%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AE-mysqlslap-%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E4%BD%BF%E3%81%88%E3%82%8B%E3%81%A7%E3%81%97%E3%82%87%E3%81%86%E3%81%8B)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## FAQ

### Q1: SQL関数の実行時間を計測するにはどうすればいいでしょうか

MySQLで関数単体の実行速度を計測できるベンチマーク用の関数は何でしょうか。

<details>
<summary>回答例</summary>

`BENCHMARK(計測回数, 計測関数)`関数を使用することで、計測したい関数を指定した回数だけ実行してその実行時間を返す。

例えば以下は現在時刻を取得する関数のベンチマークをとっている。

```bash
mysql> SELECT BENCHMARK(1000000, NOW());
+---------------------------+
| BENCHMARK(1000000, NOW()) |
+---------------------------+
|                         0 |
+---------------------------+
```

この関数を使用する際の注意点としては、サーバー上でのCPU時間ではなく、クライアント側の経過時間を計測している点であり、サーバー側の負荷の状況によって結果が前後する可能性があるため、複数回実行することが推奨されている。

- [`BENCHMARK(計測回数, 計測関数)`](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html#function_benchmark)

</details>

### Q2: MySQL公式でサポートしている負荷エミュレーションツールの mysqlslap はどのように使えるでしょうか

<details>
<summary>回答例</summary>

`mysqlslap` を使用することで複数のクライアントが同時にアクセスするような状況での負荷テストを実行することができる。

例えば以下のコマンドでは、`INT`型の列を2つ、`VARCAHR`型の列を3つ有しているテーブルに対して、5人のクライアントがクエリを20回発行する状況での負荷テストを実行している。

```bash
root@f080c363072e:/# mysqlslap -uroot -pcollege --concurrency=5 --iterations=20 --number-int-cols=2 --number-char-cols=3 --auto-generate-sql
mysqlslap: [Warning] Using a password on the command line interface can be insecure.
Benchmark
        # 平均実行時間
        Average number of seconds to run all queries: 0.062 seconds
        # 最小実行時間
        Minimum number of seconds to run all queries: 0.052 seconds
        # 最大実行時間
        Maximum number of seconds to run all queries: 0.087 seconds
        # クライアントの数
        Number of clients running queries: 5
        # 1クライアントが発行するSQLの数
        Average number of queries per client: 0
```

`--only-print`を付与すれば実際に発行しているクエリを確認できる。

参考資料

- [4.5.8 mysqlslap — A Load Emulation Client](https://dev.mysql.com/doc/refman/8.0/en/mysqlslap.html)

</details>

## 参考資料

- [[MySQL 8.0 Reference] 8.13 Measuring Performance (Benchmarking)](https://dev.mysql.com/doc/refman/8.0/en/optimize-benchmarking.html)
- [[MySQL 8.0 Reference] 27.19 Using the Performance Schema to Diagnose Problems](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-examples.html)
