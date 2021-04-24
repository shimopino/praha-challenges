# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

## Jaywalking

### 問題設定

以下の状況を考える。

- ある会社で製品の情報を管理している
- 1つの製品に対して、1つの説明文が存在する
- 1つの製品に対して、複数のタグを付与することができる

この仕様を満たす以下のテーブル設計の課題点を考える。

- 1つの製品レコードに対して、`tags`カラムを用意する
- `tags`カラムにコンマ区切りでタグを追加する
  - 例: `web,test,database`

なおMySQLでは以下のようにテーブルを作成することができる。

```sql
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255),
    tags VARCHAR(255)
) ENGINE=INNODB;

INSERT INTO Products (text, tags)
VALUES ('Smaple Product 1', 'web,test,database');
```

中身を確認してみると以下のようになっている。

```bash
+----+------------------+-------------------+
| id | text             | tags              |
+----+------------------+-------------------+
|  1 | Smaple Product 1 | web,test,database |
+----+------------------+-------------------+
```

ではこのテーブル設計の場合にどのような課題が発生するのか考える。

### 課題1 特定のタグで検索することが困難

例えばタグが `test` である製品を検索したい場合、単純に以下のようなクエリで検索することはできない。

```sql
SELECT * FROM Products WHERE tags = 'test';
```

以下のように `LIKE` を使用したり、`REGEXP` で正規表現で指定する必要が出てくる。

```sql
-- LIKE句
SELECT * FROM Products WHERE tags LIKE '%test%';

-- REGEXP句
-- \b で単語の境界を表現することができる
SELECT * FROM Products WHERE tags REGEXP '\\btest\\b';
```

SQLでは前方一致を含むような検索条件では、インデックスを活用することができないため、上記の設計だと検索速度にも悪影響を及ぼしてしまう。

参考資料

- [Regular Expression Compatibility Considerations](https://dev.mysql.com/doc/refman/8.0/en/regexp.html#regexp-compatibility)

### 課題2 新しいタグの付与が複雑になる

製品に対して新しくタグを付与する場合、レコードの挿入ではなく、以下のように `tags` カラムに対して区切り文字と新しいタグを追加するというロジックを考える必要がある。

```sql
UPDATE Products
Set tags = tags || ',' || 'frontend'
WHERE id = 1;
```


無効な値を排除できない。

'web,test,database,frontnend,XXXXXX'

区切り文字に何を選択すればいいのか

カラムの列の指定

```sql
DROP TABLE Products;
```