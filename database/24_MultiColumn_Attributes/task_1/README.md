# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

## 問題設定

QiitaやZennなどのブログサービスでは、投稿された記事に対してタグを付与することができる。

タグは記事に対して1つだけではなく、最大で3つまで紐づけることできるように、以下のようなテーブルを設計した。

```puml
entity Post {
    * id: varchar [PK]
    ---
    content: varchar
    + tag1: varchar [FK]
    + tag2: varchar [FK]
    + tag3: varchar [FK]
}

entity Tag {
    * id: varchar [PK]
    ---
    content: varchar
}
```

ではこのテーブル設計で発生する問題を考えていく。