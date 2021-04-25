# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

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
