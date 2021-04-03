# ペアのクイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [クイズ1](#%E3%82%AF%E3%82%A4%E3%82%BA1)
- [クイズ2](#%E3%82%AF%E3%82%A4%E3%82%BA2)
- [クイズ3](#%E3%82%AF%E3%82%A4%E3%82%BA3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## クイズ1

> 2000年以降に入社した男性社員と女性社員の内訳を求めるクエリと、それを高速化するようなインデックスを作成してください。

クエリ

```sql
SELECT SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) / COUNT(*) AS MEN_RATE
      ,SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) / COUNT(*) AS FEMALE_RATE
FROM employees
WHERE hire_date >= '2000-01-01';
```

実行計画で特徴ある点はインデックスを使用した場合に表示される `Using index condition` である。この表示がされている場合は **インデックスコンディションプッシュダウンの最適化** が実行されている。

では、インデックスコンディションプッシュダウンが使用されている場合と層ではない場合とで、どようにレコードが読み取られてフィルタリングされるのか比較してみる。

- インデックスコンディションプッシュダウンなし
  1. インデックスタプル（キーとポインタのペア）を読み込む
  2. ポインタからレコードを読み取る
  3. WHERE条件の部分をテストする
  4. テスト結果に応じて受け入れるか、拒否するか決定する
- インデックスコンディションプッシュダウンあり
  1. インデックスタプル（キーとポインタのペア）を読み込む
  2. インデックスタプルの **キーを使用** して、WHERE条件を **適用できる部分をテスト** する
  3. 条件を満たしている場合、ポインタからレコードを読み取る
  4. WHERE条件の残りの部分をテストする
  5. テスト結果に応じて受け入れるか、拒否するか決定する

実際にイベント情報から実行時間を見ても、高速化されていることがわかる。

```bash
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |    0.0001 |   0.0000 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/Opening tables                       |    0.0000 |   0.0000 |
| stage/sql/init                                 |    0.0000 |   0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0000 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/executing                            |    0.0368 |   0.0000 |
| stage/sql/end                                  |    0.0000 |   0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |
| stage/sql/freeing items                        |    0.0000 |   0.0000 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |
+------------------------------------------------+-----------+----------+
|                                                |    0.0371 |   0.0000 |
+------------------------------------------------+-----------+----------+
```

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

実行結果を比較すると大きく異なるのは `Extra` の部分である。

これはクイズ1のインデックスコンディションプッシュダウンを使用しているためである。

- インデックスなし
  - `Using where; Using temporary; Using filesort`
- インデックスあり
  - `Using index condition; Using temporary; Using filesort`

実際にイベント情報から実行時間を見ても、高速化されていることがわかる。

```bash
+------------------------------------------------+-----------+----------+
| Stage                                          | w/o index | w/ index |
+------------------------------------------------+-----------+----------+
| stage/sql/starting                             |    0.0000 |   0.0001 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |
| stage/sql/Opening tables                       |    0.0000 |   0.0000 |
| stage/sql/init                                 |    0.0000 |   0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0000 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |
| stage/sql/Creating tmp table                   |    0.0000 |   0.0000 |
| stage/sql/executing                            |    0.0473 |   0.0044 |
| stage/sql/end                                  |    0.0000 |   0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |
| stage/sql/removing tmp table                   |    0.0000 |   0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |
| stage/sql/freeing items                        |    0.0000 |   0.0000 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |
+------------------------------------------------+-----------+----------+
|                                                |    0.0475 |   0.0047 |
+------------------------------------------------+-----------+----------+
```

## クイズ3

> ファーストネームが「Ann」で始まる社員数を求めるクエリと、それを高速化するようなインデックスを作成してください。

クエリ

```sql
SELECT COUNT(*)
FROM employees
WHERE first_name LIKE 'Ann%';
```

今回は上記のクエリを使用しているが、念のため `COUNT(*)` だけではなく、`COUNT(first_name)` の場合の処理結果も比較しておく。

まずは実行計画の比較を行う。

- インデックスなし
  - フルテーブルスキャン
- インデックスあり、かつ `COUNT(*)`
  - インデックスの範囲検索
- インデックスあり、かつ `COUNT(first_name)`
  - インデックスの範囲指定

インデックスにより高速化されていることがわかる。
また `COUNT(first_name)` での違いはほとんどない。

```bash
+------------------------------------------------+-----------+----------+-------------------+
| Stage                                          | w/o index | COUNT(*) | COUNT(first_name) |
+------------------------------------------------+-----------+----------+-------------------+
| stage/sql/starting                             |    0.0000 |   0.0001 |            0.0001 |
| stage/sql/Executing hook on transaction begin. |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/starting                             |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/checking permissions                 |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/Opening tables                       |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/init                                 |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/System lock                          |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/optimizing                           |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/statistics                           |    0.0000 |   0.0001 |            0.0000 |
| stage/sql/preparing                            |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/executing                            |    0.0394 |   0.0001 |            0.0002 |
| stage/sql/end                                  |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/query end                            |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/waiting for handler commit           |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/closing tables                       |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/freeing items                        |    0.0000 |   0.0000 |            0.0000 |
| stage/sql/cleaning up                          |    0.0000 |   0.0000 |            0.0000 |
+------------------------------------------------+-----------+----------+-------------------+
| total                                          |    0.0397 |   0.0006 |            0.0006 |
+------------------------------------------------+-----------+----------+-------------------+
```

今回は前方一致のクエリだったのでインデックスが有効であったが、後方一致のクエリの場合にはインデックスは使用されない点に注意する必要がある。
