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
Set tags = CONCAT(tags, ',', 'frontend')
WHERE id = 1;
```

### 課題3 タグに対する検証ができない

ここでは以下のような `Tags` テーブルが存在しており、`Products` テーブルの `tags` には、`Tags` テーブルの主キーをコンマ区切りで持たせているような状況を考える。

```sql
CREATE TABLE IF NOT EXISTS Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
) ENGINE=INNODB;

INSERT INTO Tags (name)
VALUES
    ('web'),
    ('test'),
    ('database');
```

つまり以下のようなレコードを有している状況である。

```bash
+----+----------+
| id | name     |
+----+----------+
|  1 | web      |
|  2 | test     |
|  3 | database |
+----+----------+
```

現状のテーブル設計では `tags` カラムに対して外部キー制約を付与することができないため、本来では不正な値である `4` などを以下のように追加することができてしまう。

```sql
UPDATE Products
Set tags = CONCAT(tags, ',', '4')
WHERE id = 1;
```

このようにちょっとしたミスで容易に整合性が崩れてしまう。

### 課題4 区切り文字に関する制約を考える必要がある。

現在は区切り文字にコンマを使用しているが、もしもタグ名そのものにコンマを含むようなデータが挿入された場合、タグの区切りなのかタグ名の一部なのか判断することが不可能になってしまう。

```sql
-- 'back,end' という名称のタグを追加する
UPDATE Products
Set tags = CONCAT(tags, ',', 'back,end')
WHERE id = 1;
```

以下のように区切り文字なのかタグ名なのか判別がつかない。

```bash
+----+------------------+----------------------------+
| id | text             | tags                       |
+----+------------------+----------------------------+
|  1 | Smaple Product 1 | web,test,database,back,end |
+----+------------------+----------------------------+
```





```sql
DROP TABLE Products;
DROP TABLE Tags;
```