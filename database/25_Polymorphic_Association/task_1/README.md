# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

## 問題設定

[読書メーター](https://bookmeter.com/) のように漫画や小説などのリソースが存在しており、どちらのリソースにもユーザーはコメントを追加できるサービスとする。

このときに以下のテーブル設計を考える。

```puml
entity Manga {
    * id: varchar [PK]
    ---
    name: varchar 
}

entity Novel {
    * id: varchar
    ---
    name: varchar
}

entity Comment {
    * id: varchar
    ---
    text: varchar
    belongs_to_id: varchar [FK]
}
```

![](../assets/problem.png)

ここでは `Comment` テーブルに対して `belongs_to_id` カラムを持たせ、値として `Manga.id` や `Novel.id` を持たせることでそれぞれのリソースを紐づけている。


