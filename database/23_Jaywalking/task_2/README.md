# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [交差テーブル](#%E4%BA%A4%E5%B7%AE%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB)
  - [課題1 特定のタグで検索することが困難](#%E8%AA%B2%E9%A1%8C1-%E7%89%B9%E5%AE%9A%E3%81%AE%E3%82%BF%E3%82%B0%E3%81%A7%E6%A4%9C%E7%B4%A2%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E5%9B%B0%E9%9B%A3)
  - [課題2 新しいタグの付与が複雑になる](#%E8%AA%B2%E9%A1%8C2-%E6%96%B0%E3%81%97%E3%81%84%E3%82%BF%E3%82%B0%E3%81%AE%E4%BB%98%E4%B8%8E%E3%81%8C%E8%A4%87%E9%9B%91%E3%81%AB%E3%81%AA%E3%82%8B)
  - [課題3 タグに対する検証ができない](#%E8%AA%B2%E9%A1%8C3-%E3%82%BF%E3%82%B0%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E6%A4%9C%E8%A8%BC%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%84)
  - [課題4 区切り文字に関する制約を考える必要がある。](#%E8%AA%B2%E9%A1%8C4-%E5%8C%BA%E5%88%87%E3%82%8A%E6%96%87%E5%AD%97%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E5%88%B6%E7%B4%84%E3%82%92%E8%80%83%E3%81%88%E3%82%8B%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8B)
  - [課題5 tags カラムの文字列長の可変性](#%E8%AA%B2%E9%A1%8C5-tags-%E3%82%AB%E3%83%A9%E3%83%A0%E3%81%AE%E6%96%87%E5%AD%97%E5%88%97%E9%95%B7%E3%81%AE%E5%8F%AF%E5%A4%89%E6%80%A7)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 交差テーブル

今回の課題を解決する1つの方法は、`Products` テーブルと `Tags` テーブルを紐づけるための交差テーブルを導入することである。

交差テーブル `Taggings` を導入することで、2つのテーブルを以下のように紐づけることができる。

![](../assets/jaywalking.png)

MySQLでのテーブル定義では以下のように宣言できる。

```sql
-- Productsテーブルの作成
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255)
) ENGINE=INNODB;

-- Tagsテーブルの作成
CREATE TABLE IF NOT EXISTS Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(255)
) ENGINE=INNODB;

-- Taggingsテーブルの作成
CREATE TABLE IF NOT EXISTS Taggings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    UNIQUE(product_id, tag_id),
    FOREIGN KEY (product_id)
        REFERENCES Products(id),
    FOREIGN KEY (tag_id)
        REFERENCES Tags(id)
) ENGINE=INNODB;
```

これでテーブル定義は完了したので、事前に以下のデータを用意しておく。

```sql
INSERT INTO Products (text)
VALUES ('Sample Product #1');

INSERT INTO Tags (tag)
VALUES
    ('web'),
    ('test'),
    ('database');

INSERT INTO Taggings (product_id, tag_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3);
```

これでコンマ区切りを使用していたテーブル設計で発生していた課題を解決することができる。

### 課題1 特定のタグで検索することが困難

コンマ区切りを使用したいた場合は `LIKE` 句を使用したり、正規表現を活用しなければ特定のタグに紐づく製品を検索することが困難だった。

交差テーブルを導入することで、テーブルを結合させるクエリで検索することができる。

```sql
SELECT * FROM Products
INNER JOIN Taggings ON Products.id = Taggings.product_id
INNER JOIN Tags ON Taggings.tag_id = Tags.id
AND Tags.tag = 'test';
```

この場合はインデックスを活用できるため、コンマ区切りの場合よりも高速に結果を得ることができる。


### 課題2 新しいタグの付与が複雑になる

新しいタグを製品に追加したい場合は、単純に `Taggings` に紐づけたいレコードを追加すればいいだけである。

```sql
-- 新しいタグを作製する
INSERT INTO Tags (tag)
VALUES ('frontend');

-- 新しいタグを製品に紐づける
INSERT INTO Taggings (product_id, tag_id)
VALUES (1, 4);
```

これで製品IDが `1` に対して新たに作成したタグを紐づけることができた。

```bash
+----+------------+--------+
| id | product_id | tag_id |
+----+------------+--------+
|  1 |          1 |      1 |
|  2 |          1 |      2 |
|  3 |          1 |      3 |
|  4 |          1 |      4 |
+----+------------+--------+
```

紐づけを削除する場合は単にレコードを削除すればいいだけである。

```sql
DELETE FROM Taggings
WHERE product_id = 1
AND tag_id = 4;
```

### 課題3 タグに対する検証ができない

`Taggings` テーブルの製品IDとタグIDには外部キー制約を設けているため、存在しない製品やタグを紐づけることができなくなり、処理の整合性を保つことができるようになる。

```sql
-- 製品ID ('1') に、存在しないタグID ('4') を紐づけてみる
INSERT INTO Taggings (product_id, tag_id)
VALUES (1, 4);

-- 外部キー制約による例外が発生する
-- ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`employees`.`Taggings`, CONSTRAINT `Taggings_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`id`)
```

### 課題4 区切り文字に関する制約を考える必要がある。

交差テーブルを追加することで、1つのタグの名称は1つのレコードとして管理されているため、コンマ区切りなどの概念は存在しなくなった。

そのため以下のようにコンマを含むタグ名を追加しても、タグIDをもとに関単に識別することが可能である。

```sql
-- Tagsテーブルにコンマ付きの名称を追加する
INSERT INTO Tags (tag)
VALUES ('back,end');
```

これで以下のようなレコードが挿入され、紐づけにはIDしか使用しないため、コンマが含まれている名称であっても、容易に識別することが可能である。

```bash
+----+----------+
| id | tag      |
+----+----------+
|  1 | web      |
|  2 | test     |
|  3 | database |
|  5 | back,end |
+----+----------+
```

### 課題5 tags カラムの文字列長の可変性

交差テーブルを導入する前は、1つの製品に対して **全タグ名** の文字列長が255バイトを超えてはいけないという制約が存在していた。

しかし交差テーブルを導入することで製品とタグの紐づけはIDだけで完結するようになり、タグの文字列長に関しては以下の定義を見てわかるように、 **1つのタグ名** が文字列長が255バイトを越えなければいい状態である。

```sql
CREATE TABLE IF NOT EXISTS Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(255)
) ENGINE=INNODB;
```

もしも紐づけることが可能な最大数などの制約を儲けたい場合は、`COUNT`を使用した`CHECK`制約を設けたり、アプリケーション側で制御すればいいだけである。
