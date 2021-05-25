# 参考資料

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Hasura](#hasura)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Hasura

Hasuraが公式で出している [コース](https://hasura.io/learn/graphql/hasura-auth-slack/introduction/) の内容でモデリングの練習をする。

作成する Slack アプリの仕様は以下になる。

- ユーザーは SignUp できる
- ユーザーは Workspace を作成できる
- Workspace は所有者か権限者が管理できる
- ユーザーを Workspace 内の Channel に追加できる
- ユーザーは参加している Channel にメッセージを送信できる
- ユーザーは同じ Workspace のユーザーにメッセージを送信できる
- ユーザーは同じ Workspace のユーザーがオンライン状態か確認できる
