# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [交差テーブル](#%E4%BA%A4%E5%B7%AE%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 交差テーブル

この問題は **マルチカラムアトリビュート** と呼ばれており、課題23と同じく交差テーブルの導入で解決できる。

つまり複数の列ではなく、複数の行で記事とタグの関係性を表現する。

```puml
entity Post {
    * id: varchar [PK]
    ---
    content: varchar
}

entity Taggings {
    * id: varchar [PK]
    ---
    post_id: varchar [FK]
    tag_id: varchar [FK]
}

entity Tag {
    * id: varchar [PK]
    ---
    content: varchar
}

Post ||-r-o{ Taggings
Tag ||-l-o{ Taggings
```

![](../assets/answer.png)

ではこのテーブルを導入することで、課題がどのように解決されるのか見ていく。

なお説明時には以下のクエリを使用しており、`UNIQUE制約`を設けることで記事に同じタグを付与できないようにしている。

```sql
CREATE TABLE IF NOT EXISTS Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Taggings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    tag_id INT,
    FOREIGN KEY (post_id)
        REFERENCES Post(post_id),
    FOREIGN KEY (tag_id)
        REFERENCES Tag(tag_id),
    UNIQUE(post_id, tag_id)
) ENGINE=InnoDB;

INSERT INTO Post (content)
VALUES
    ('sample post 1'),
    ('sample post 2'),
    ('sample post 3'),
    ('sample post 4');

INSERT INTO Tag (content)
VALUES
    ('web'),
    ('test'),
    ('database'),
    ('backend'),
    ('frontend');

INSERT INTO Taggings (post_id, tag_id)
VALUES
    (1, 1),
    (2, 1),
    (2, 2),
    (3, 1),
    (3, 3),
    (4, 1),
    (4, 4),
    (4, 5);
```

### 課題1 タグ名での検索が冗長になる

上記のER図の場合、タグ名で検索を行う場合は単純に `Tag` テーブルから検索対象のタグ名称に紐づいている `tag_id` を抽出し、`Taggins` テーブルから同じIDに紐づいている記事を抽出すればいい。

```sql
SELECT Post.post_id, Post.content, Tag.tag_id, Tag.content
FROM Post
INNER JOIN Taggings ON Taggings.post_id = Post.post_id
INNER JOIN Tag ON Tag.tag_id = Taggings.tag_id
AND Tag.content = 'test';
```

これで以下のように記事を抽出することができる。

```bash
+---------+---------+--------+---------+
| post_id | content | tag_id | content |
+---------+---------+--------+---------+
|       2 | 2       |      2 | test    |
+---------+---------+--------+---------+
```

変更前のテーブル定義と比較して、検索対象のタグ名称の論理積や論理和などを考慮する必要はなくなっている。

ただしクエリ内でテーブルの結合を行っており、正しくそれぞれのリソースに関係性を理解していなければ、クエリを作成することは難しい。

### 課題2 整合性の担保が難しい

変更前のテーブル定義では、同じ記事に対して容易に同じタグを付与することが可能であった。

変更後のテーブル定義では、記事とタグの関係性を表している `Taggings` テーブルに対して `UNIQUE(post_id, tag_id)` という制約を設けており、同じ記事に対して同じタグを付与することは一意性制約により防ぐことができる。

```sql
INSERT INTO Taggings (post_id, tag_id)
VALUES (1, 1);
```

例えば上記のクエリを実行すれば、以下のようにエラーが返される。

```bash
ERROR 1062 (23000): Duplicate entry '1-1' for key 'Taggings.post_id'
```

### 課題3 タグを追加する仕様変更への対応が難しい

変更前のテーブル定義では、記事に対して付与できるタグの数を3つから5つに変更したい場合、`Post` テーブルに対して新しくタグのカラムを追加するしかなかった。

変更後のテーブル定義では、記事とタグの関係性をカラムではなく行で表現しているため、記事に紐づけたりタグの数を増加させたい場合は、単純にレコードを追加すればいいだけである。

例えば `sample post 4` という記事にはタグが3つ付与されている。

```bash
mysql> SELECT Post.post_id, Post.content, Tag.tag_id, Tag.content
       FROM Post
       INNER JOIN Taggings ON Taggings.post_id = Post.post_id
       INNER JOIN Tag ON Tag.tag_id = Taggings.tag_id
       AND Tag.content = 'sample post 4';
+---------+---------------+--------+----------+
| post_id | content       | tag_id | content  |
+---------+---------------+--------+----------+
|       4 | sample post 4 |      1 | web      |
|       4 | sample post 4 |      4 | backend  |
|       4 | sample post 4 |      5 | frontend |
+---------+---------------+--------+----------+
```

タグを5つまで追加したい場合は `Taggings` テーブルに記事とタグを紐づけるレコードを追加すればいいだけである。

```sql
INSERT INTO Taggings (post_id, tag_id)
VALUES
    (4, 2),
    (4, 3);
```

これで同じクエリを実行すれば、新しく記事にタグが紐づけられていることがわかる。

```bash
mysql> SELECT Post.post_id, Post.content, Tag.tag_id, Tag.content
       FROM Post
       INNER JOIN Taggings ON Taggings.post_id = Post.post_id
       INNER JOIN Tag ON Tag.tag_id = Taggings.tag_id
       AND Tag.content = 'sample post 4';
+---------+---------------+--------+----------+
| post_id | content       | tag_id | content  |
+---------+---------------+--------+----------+
|       4 | sample post 4 |      1 | web      |
|       4 | sample post 4 |      2 | test     |
|       4 | sample post 4 |      3 | database |
|       4 | sample post 4 |      4 | backend  |
|       4 | sample post 4 |      5 | frontend |
+---------+---------------+--------+----------+
```
