# 課題2

<!-- START doctoc -->
<!-- END doctoc -->

## 環境構築

今回はER図を `PlantUML` で作成するため、改めて環境構築を行う。

```bash
# javaのインストール
sudo apt install -y default-jre
javac --version

# graphvizのインストール
sudo apt -y install graphviz
dot -V
```

## GithubのIssue

以下の仕様を満たすようなER図を考える。

- GithubのIssueにassigneeを割り当てる
- issueはassigneeの割り当てなしで作成可能である。

単純に以下のようなテーブル設計を行ってしまうと、Issueテーブルの`assigned_to_id` に `NULL` を許容してしまうことになる。

![](../assets/Bad%20ER.png)

この設計は [SQLアンチパターン](https://www.oreilly.co.jp/books/9784873115894/) の第7章で紹介されている **マルチカラムアトリビュート（複数列属性）** になってしまう可能性がある。

つまりissueに対して複数のassigneeを割り当てるような仕様変更が発生した際に、別途異なるカラムを作成する必要があり、さらに`NULL`が発生する可能性が増大したり、将来的にもカラムを増加させる必要がある点など、様々な問題が発生してしまう。

解決策として **従属テーブル** の作成が考えられる。

例えば`assignee`と`issue`のそれぞれのIDをカラムに持っているテーブル `assign` を作成することで、ユーザーとIssueとの紐づけを表現することができる。

![](../assets/Good%20ER%20r1.png)

これでもともとは `assignee` が割り当てられていない状況を、カラムの `NULL` で表現していた代わりに、`assign` テーブルに該当する行が存在しないという、行単位での表現に変更することができた。

## ER図の書き方

