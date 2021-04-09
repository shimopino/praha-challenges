# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [複合インデックスとは何か](#%E8%A4%87%E5%90%88%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [実際の並び順の確認](#%E5%AE%9F%E9%9A%9B%E3%81%AE%E4%B8%A6%E3%81%B3%E9%A0%86%E3%81%AE%E7%A2%BA%E8%AA%8D)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 複合インデックスとは何か

**複合インデックス** とは複数の列をひとかたまりで扱うことのできるインデックスである。

例えばMySQLの[公式ドキュメント](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)で使用されている以下のテーブル定義を考える。

```sql
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

このときに例えば以下のクエリを実行すると、複合インデックスの最初の列である `last_name` を使用して絞り込みを行い、そのあとで2番目の列である `first_name` を使用して絞り込むことで、フルテーブルスキャンを行うことなく目的のレコードを抽出することができる。

```sql
SELECT * FROM test
WHERE last_name='Jones' AND first_name='John';
```

複合インデックスでは、指定する列の順番に気を付ける必要があり、例えば以下のクエリを実行すると、インデックスは使用されずにフルテーブルスキャンが実行される。

```sql
SELECT * FROM test
WHERE last_name='Jones' OR first_name='John';
```

これは複合インデックスでは、最初の列である `last_name` を基準にリーフノードが構築されており、そのリーフノードの中の順番はばらばらであるため、`first_name` が `John` であるエントリを探すには、結局すべてのインデックスを走査する必要があるためである。

課題として提示されている以下の複合インデックスでも、検索クエリで `last_name`、つまり姓のみを指定している場合は、フルテーブルスキャンになってしまう。

```sql
CREATE INDEX employees_name ON employees (first_name, last_name)
```

複合インデックスを使用する場合には、検索で頻繁に使用する列をインデックスの最初に持ってくることで、より多くのクエリに対して複合インデックスの恩恵を受けることができるようになる。

## 実際の並び順の確認

以下のクエリを実行して複合インデックスの並び順を確認することができる。

```sql
SELECT last_name, first_name
FROM employees
ORDER BY last_name, first_name
LIMIT 1000;
```

この結果として最初の列である `last_name` を基準に並び替えが実行されており、特定の `last_name` の中でさらに `first_name` が並び替えられていることがわかる。

```bash
+-----------+------------+
| last_name | first_name |
+-----------+------------+
| Aamodt    | Abdelkader |
| Aamodt    | Adhemar    |
| Aamodt    | Aemilian   |
| Aamodt    | Alagu      |
| Aamodt    | Aleksander |
| Aamodt    | Alexius    |
| Aamodt    | Alois      |
| Aamodt    | Aluzio     |
| Aamodt    | Amabile    |
| Aamodt    | Anestis    |
+-----------+------------+
```

このことからも2番目の列である `first_name` だけを指定した絞り込みでは、複合インデックスは役に立たないことがわかる。
