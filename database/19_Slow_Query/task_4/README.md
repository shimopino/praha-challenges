# 課題4

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [`LIMIT 1` でもクエリが遅い場合とは](#limit-1-%E3%81%A7%E3%82%82%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%8C%E9%81%85%E3%81%84%E5%A0%B4%E5%90%88%E3%81%A8%E3%81%AF)
- [`WHERE` と `ON` の使い分け](#where-%E3%81%A8-on-%E3%81%AE%E4%BD%BF%E3%81%84%E5%88%86%E3%81%91)
  - [実行結果の確認](#%E5%AE%9F%E8%A1%8C%E7%B5%90%E6%9E%9C%E3%81%AE%E7%A2%BA%E8%AA%8D)
  - [実行速度が異なる理由](#%E5%AE%9F%E8%A1%8C%E9%80%9F%E5%BA%A6%E3%81%8C%E7%95%B0%E3%81%AA%E3%82%8B%E7%90%86%E7%94%B1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## `LIMIT 1` でもクエリが遅い場合とは

`LIMIT` で1件だけを取得する処理にしていたとしても、その前にテーブルからレコードを抽出した後で結果セットを絞っているだけであり、`LIMIT` 前の処理に最終的な実行時間は影響される。

1. FROM
2. ON
3. JOIN
4. WHERE
5. GROUP BY
6. HAVING
7. SELECT
8. DISTINCT
9. ORDER BY
10. TOP（LIMIT）

もしも `ORDER BY` を併用しているクエリであれば、並び替えの基準としている列に対してインデックスを作成している場合、インデックス内ではすでに並び替えられているため実行速度を高速化することができる。

MySQL8.0.21から導入された `prefer_ordering_index` では、`LIMIT` と `ORDER BY` が存在するクエリに対して、`ORDER BY` で指定しているカラムにインデックスが存在すると、優先して対象のインデックスを使用する設定になっている。なお、デフォルトでは `ON` である。

```sql
mysql> select @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,index_merge_sort_union=on,index_merge_intersection=on,engine_condition_pushdown=on,index_condition_pushdown=on,mrr=on,mrr_cost_based=on,block_nested_loop=on,batched_key_access=off,materialization=on,semijoin=on,loosescan=on,firstmatch=on,duplicateweedout=on,subquery_materialization_cost_based=on,use_index_extensions=on,condition_fanout_filter=on,derived_merge=on,use_invisible_indexes=off,skip_scan=on,hash_join=on,subquery_to_derived=off,prefer_ordering_index=on,hypergraph_optimizer=off,derived_condition_pushdown=on
```

注意点としては、`WHERE` でレコード数を絞り込む際に活用できるインデックスが存在している場合に、`ORDER BY` で指定されたカラムのインデックスが優先して選択されてしまい、結果としてクエリの実行速度が遅くなってしまう可能性がある点である。


参考資料

- [SELECT文の評価順序の話](https://qiita.com/suzukito/items/edcd00e680186f2930a8)
- [第135回　MySQL 8.0で追加されたoptimizer_switchのフラグについて](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0135)

## `WHERE` と `ON` の使い分け

### 実行結果の確認

今回の課題で提示されているクエリの実行計画と実行時間を確認する。

なお下記のクエリでは `JOIN` が指定されているが、これは `INNER JOIN` と同じである。
（MySQLの `JOIN` のデフォルトは内部結合になっている。）

- クエリ1
  - `WHERE` を使用してフィルタリングする

    ```sql
    SELECT *
    FROM employees e
    JOIN salaries s ON e.emp_no = s.emp_no
    WHERE gender = "M"
    AND birth_date > "1960-01-01"
    ```

- クエリ2
  - `ON` を使用してフィルタリングする

    ```sql
    SELECT *
    FROM employees e
    JOIN salaries s ON e.emp_no = s.emp_no 
    AND gender = "M" 
    AND birth_date > "1960-01-01"
    ```

まずは実行計画を確認すると、どちらのクエリでも計画に変化がないことがわかる。

```bash
# クエリ1
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key     | key_len | ref                | rows   | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+
|  1 | SIMPLE      | e     | NULL       | ALL  | PRIMARY       | NULL    | NULL    | NULL               | 298990 |    16.66 | Using where |
|  1 | SIMPLE      | s     | NULL       | ref  | PRIMARY       | PRIMARY | 4       | employees.e.emp_no |      9 |   100.00 | NULL        |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+

# クエリ2
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key     | key_len | ref                | rows   | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+
|  1 | SIMPLE      | e     | NULL       | ALL  | PRIMARY       | NULL    | NULL    | NULL               | 298990 |    16.66 | Using where |
|  1 | SIMPLE      | s     | NULL       | ref  | PRIMARY       | PRIMARY | 4       | employees.e.emp_no |      9 |   100.00 | NULL        |
+----+-------------+-------+------------+------+---------------+---------+---------+--------------------+--------+----------+-------------+
```

次に実行時間を確認すると、明らかに `ON` を使用してフィルタリングを行ったほうが実行時間が短縮されていることがわかる。

```bash
+------------------------------------------------+----------+----------+
| Stage                                          |  query 1 |  query 2 |
+------------------------------------------------+----------+----------+
| stage/sql/starting                             |   0.0001 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |   0.0000 |   0.0000 |
| stage/sql/starting                             |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/checking permissions                 |   0.0000 |   0.0000 |
| stage/sql/Opening tables                       |   0.0000 |   0.0000 |
| stage/sql/init                                 |   0.0000 |   0.0000 |
| stage/sql/System lock                          |   0.0000 |   0.0000 |
| stage/sql/optimizing                           |   0.0000 |   0.0000 |
| stage/sql/statistics                           |   0.0000 |   0.0000 |
| stage/sql/preparing                            |   0.0000 |   0.0000 |
| stage/sql/executing                            |   0.8462 |   0.5713 |
| stage/sql/end                                  |   0.0000 |   0.0000 |
| stage/sql/query end                            |   0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |   0.0000 |   0.0000 |
| stage/sql/closing tables                       |   0.0000 |   0.0000 |
| stage/sql/freeing items                        |   0.0000 |   0.0000 |
| stage/sql/cleaning up                          |   0.0000 |   0.0000 |
+------------------------------------------------+----------+----------+
| total                                          |   0.8466 |   0.5717 |
+------------------------------------------------+----------+----------+
```

### 実行速度が異なる理由

実行順序が影響している。

- `WHERE`
  - 結合した後の結果セットに対してフィルタリングを行う
- `ON`
  -  結合前の右側のテーブルに対してフィルタリングを行う

これはMySQLがサポートしている `Nested Loop Join (NLJ)` が関係している。

例えば以下の3つのテーブルを指定の方法で結合させることを考える。

```bash
Table   Join Type   
t1      range       # インデックスを使用した範囲検索
t2      ref         # インデックスを走査して一致するリーフノードを検索
t3      ALL         # フルテーブルスキャン
```

`NJL` ではこの3つのテーブルの結合を次のように実装している。

```bash
# インデックスでの範囲指定（BETWEEN や 比較演算子での指定）
for each row in t1 matching range {
  # インデックスから指定した値に該当するものを走査（Uniqueインデックスではない）
  for each row in t2 matching reference key {
    # フルテーブルスキャン
    for each row in t3 {
      if row satisfies join conditions, send to client
    }
  }
}
```

`WHERE` でのフィルタリングを行った場合、全てのインデックスやテーブルのレコードに対して結合処理を行った後でフィルタリングが実行されるが、`ON` でのフィルタリングを行った場合、上記の実装でいえばループの回数そのものを削減することができるため、実行速度が短縮されている結果となる。

参考資料

- [[MySQL 8.0 Reference] 8.2.1.7 Nested-Loop Join Algorithms](https://dev.mysql.com/doc/refman/8.0/en/nested-loop-joins.html)
- [実例で学ぶ、JOIN (NLJ) が遅くなる理屈と対処法](https://qiita.com/yuku_t/items/208be188eef17699c7a5)
