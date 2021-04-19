# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [NULLを含むクエリの演算結果](#null%E3%82%92%E5%90%AB%E3%82%80%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E6%BC%94%E7%AE%97%E7%B5%90%E6%9E%9C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## NULLを含むクエリの演算結果

SQLの真理値型は `true`、`false`、`unknown` を有する **3値論理** である。

`NULL` はそもそもデータが存在していないことを意味しており、比較述語を使用して値を比較しようとしても、そもそもの値が存在していないので演算結果は `NULL` になってしまう。

ただし以下のように論理積と論理和では、例外があるため注意が必要である。

| query                  | result |
| ---------------------- | ------ |
| SELECT TRUE = TRUE;    | 1      |
| SELECT TRUE = FALSE;   | 0      |
| SELECT NULL = 0;       | NULL   |
| SELECT NULL = NULL;    | NULL   |
| SELECT NULL <> NULL;   | NULL   |
| SELECT NULL AND TRUE;  | NULL   |
| SELECT NULL AND FALSE; | 0      |
| SELECT NULL OR TRUE;   | 1      |
| SELECT NULL OR FALSE;  | NULL   |

この結果は参考資料にあるように、3つの論理値の間の優先順位を考えると理解しやすく、優先順位が高いほうが低いほうを飲み込むと考えればよい。

| operation |        priority        |
| :-------: | :--------------------: |
|    AND    | false > unknown > true |
|    OR     | true > unknown > false |

3値論理であることを意識せずに2値論理としてクエリを実行してしまうと、上記の論理演算の結果に従って、誤った結果を取得してしまう可能性がある。

試しに `departments` テーブルに対して `dept_name` に `NULL` を挿入する。

```sql
CREATE TABLE IF NOT EXISTS samples (
    sample_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    from_date DATE,
    to_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB;
```

サンプルデータとして以下を挿入する。

```sql
INSERT INTO samples (title, from_date, to_date, description)
VALUES
    ('sample1', '1990-01-01', '1991-01-01', 'sample'),
    ('sample2', '1991-01-02', '1992-01-02', 'praha'),
    ('sample3', '1992-01-03', '1993-01-03', NULL),
    ('sample4', '1993-01-04', '1994-01-04', 'challenge'),
    ('sample5', '1994-01-05', NULL, NULL);
```

これで以下のようなテーブルの状態が用意できている。

```bash
+-----------+---------+------------+------------+-------------+---------------------+
| sample_id | title   | from_date  | to_date    | description | created_at          |
+-----------+---------+------------+------------+-------------+---------------------+
|         1 | sample1 | 1990-01-01 | 1991-01-01 | sample      | 2021-04-18 22:47:28 |
|         2 | sample2 | 1991-01-02 | 1992-01-02 | praha       | 2021-04-18 22:47:28 |
|         3 | sample3 | 1992-01-03 | 1993-01-03 | NULL        | 2021-04-18 22:47:28 |
|         4 | sample4 | 1993-01-04 | 1994-01-04 | challenge   | 2021-04-18 22:47:28 |
|         5 | sample5 | 1994-01-05 | NULL       | NULL        | 2021-04-18 22:47:28 |
+-----------+---------+------------+------------+-------------+---------------------+
```

ここで `description` が `sample` 以外のレコードを抽出する。

```sql
SELECT * FROM samples
WHERE description <> 'sample';
```

クエリを実行すると `description` が `NULL` のレコードに関しては抽出できていないことがわかる。

```bash
+-----------+---------+------------+------------+-------------+---------------------+
| sample_id | title   | from_date  | to_date    | description | created_at          |
+-----------+---------+------------+------------+-------------+---------------------+
|         2 | sample2 | 1991-01-02 | 1992-01-02 | praha       | 2021-04-18 22:47:28 |
|         4 | sample4 | 1993-01-04 | 1994-01-04 | challenge   | 2021-04-18 22:47:28 |
+-----------+---------+------------+------------+-------------+---------------------+
```

これは `NULL` を含む値との比較演算子の結果が `NULL` になってしまい、`TRUE` にはならないためレコードとして抽出されないからである。

参考資料

- [3値論理とNULL](https://codezine.jp/article/detail/532)
