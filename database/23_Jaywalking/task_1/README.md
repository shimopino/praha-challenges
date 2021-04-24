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


パターンマッチ

```sql
SELECT * FROM Products WHERE tags REGEXP '\\btest\\b';
```

Regular Expression Compatibility Considerations

https://dev.mysql.com/doc/refman/8.0/en/regexp.html#regexp-compatibility

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