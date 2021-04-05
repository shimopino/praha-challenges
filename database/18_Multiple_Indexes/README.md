# 課題18「複合インデックスを理解する」

<!-- START doctoc -->
<!-- END doctoc -->

## 課題1

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

複合インデックスでは、指定する列の順番に気を付ける必要があり、例えば以下のっクエリを実行すると、インデックスは使用されずにフルテーブルスキャンが実行される。

```sql
SELECT * FROM test
WHERE last_name='Jones' OR first_name='John';
```

これは複合インデックスでは、最初の列である `last_name` を基準にリーフノードが構築されており、そのリーフノードの中の順番はばらばらであるため、`first_name` が `John` であるエントリを探すには、結局すべてのインデックスを走査する必要があるためである。

課題として提示されている以下の複合インデックスでも、検索クエリで `last_name`、つまり姓のみを指定している場合は、フルテーブルスキャンになってしまう。

```sql
CREATE INDEX employees_name ON employees (first_name, last_name)
```

複合インデックスを使用する場合には、最も検索で使用する列をインデックスの最初に持ってくることで、より多くのクエリに対して複合インデックスの恩恵を受けることができるようになる。

## 調査結果


## 課題2

### クエリその1



### クエリその2

### クエリその3

## 課題3


