# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Jaywalking](#jaywalking)
  - [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 特定のタグで検索することが困難](#%E8%AA%B2%E9%A1%8C1-%E7%89%B9%E5%AE%9A%E3%81%AE%E3%82%BF%E3%82%B0%E3%81%A7%E6%A4%9C%E7%B4%A2%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E5%9B%B0%E9%9B%A3)
  - [課題2 新しいタグの付与が複雑になる](#%E8%AA%B2%E9%A1%8C2-%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%82%B0%E3%81%AE%E4%BB%98%E4%B8%8E%E3%81%8C%E8%A4%87%E9%9B%91%E3%81%AB%E3%81%AA%E3%82%8B)
  - [課題3 タグに対する検証ができない](#%E8%AA%B2%E9%A1%8C3-%E3%82%BF%E3%82%B0%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E6%A4%9C%E8%A8%BC%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84)
  - [課題4 区切り文字に関する制約を考える必要がある。](#%E8%AA%B2%E9%A1%8C4-%E5%8C%BA%E5%88%87%E3%82%8A%E6%96%87%E5%AD%97%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E5%88%B6%E7%B4%84%E3%82%92%E8%80%83%E3%81%88%E3%82%8B%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8B)
  - [課題5 `tags` カラムの文字列長の可変性](#%E8%AA%B2%E9%A1%8C5-tags-%E3%82%AB%E3%83%A9%E3%83%A0%E3%81%AE%E6%96%87%E5%AD%97%E5%88%97%E9%95%B7%E3%81%AE%E5%8F%AF%E5%A4%89%E6%80%A7)
- [実験環境の後片付け](#%E5%AE%9F%E9%A8%93%E7%92%B0%E5%A2%83%E3%81%AE%E5%BE%8C%E7%89%87%E4%BB%98%E3%81%91)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

参考資料

- [[Stackoverflow] String concatenation in MySQL](https://stackoverflow.com/questions/5975958/string-concatenation-in-mysql)

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

### 課題5 `tags` カラムの文字列長の可変性

今回は `tags` の定義を `VARCHAR(255)` と設定している。

もしも製品にタグ付けされているタグ名の文字列長が、上記の定義を超えてしまう場合、対象の製品には新しくタグを付与することができなくなってしまう。

```sql
-- 'back,end' という名称のタグを追加する
UPDATE Products
Set tags = <<String vallue of its Length over 255 bytes>>
WHERE id = 1;

-- 以下のような例外が発生してしまう
-- ERROR 1406 (22001): Data too long for column 'tags' at row 1
```

設定した文字列長が将来にわたって保証されるかどうか明らかにすることは難しい。

## 実験環境の後片付け

```sql
DROP TABLE Products;
DROP TABLE Tags;
```