# DVWAでの実演

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [DVWAでの実演](#dvwaでの実演)
  - [XSS](#xss)
    - [Q1:](#q1)
    - [Q2:](#q2)
    - [Q3:](#q3)
  - [Command Injection](#command-injection)
    - [Q1:](#q1-1)
    - [Q2:](#q2-1)
    - [Q3:](#q3-1)
  - [SQL Injection](#sql-injection)
    - [Q1:](#q1-2)
    - [Q2:](#q2-2)
    - [Q3:](#q3-2)
  - [CSRF](#csrf)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## XSS

実験結果は全て [xss_r.md](./xss_r.md) に記載している。

実験内容としては [vulnerabilities/xss_r/] のサイトに対して以下の質問に回答する形式である。

### Q1: 

Security Level を Low に設定した状態で、サイトのCookieを表示させてみましょう。

また、なぜCookieを表示させることができたのかソースコードを使って説明してみましょう。

### Q2: 

Security Level を Medium に設定した状態で、サイトのCookieを表示させてみましょう。

また、なぜCookieを表示させることができたのかソースコードを使って説明してみましょう。

### Q3: 

Security Level を High に設定した状態で、サイトのCookieを表示させてみましょう。

また、なぜCookieを表示させることができたのかソースコードを使って説明してみましょう。

## Command Injection

実験結果は全て [exec.md](./exec.md) に記載している。

実験内容としては [vulnerabilities/exec/] のサイトに対して以下の質問に回答する形式である。

### Q1: 

Security Level を Low に設定した状態で、ホストOSのトップディレクトリを表示させてみましょう。

また、なぜディレクトリを表示させることができたのかソースコードを使って説明してみましょう。

### Q2: 

Security Level を Medium に設定した状態で、ホストOSのトップディレクトリを表示させてみましょう。

また、なぜディレクトリを表示させることができたのかソースコードを使って説明してみましょう。

### Q3: 

Security Level を High に設定した状態で、ホストOSのトップディレクトリを表示させてみましょう。

また、なぜディレクトリを表示させることができたのかソースコードを使って説明してみましょう。

## SQL Injection

実験結果は全て [sqli.md](./sqli.md) に記載している。

実験内容としては [vulnerabilities/sqli/] のサイトに対して以下の質問に回答する形式である。

### Q1: 

Security Level を Low に設定した状態で、 `users` テーブルから `user` カラムと `password` カラムを表示させてみましょう。

また、なぜ表示させることができたのかソースコードを使って説明してみましょう。

### Q2: 

Security Level を Medium に設定した状態で、 `users` テーブルから `user` カラムと `password` カラムを表示させてみましょう。

また、なぜ表示させることができたのかソースコードを使って説明してみましょう。

### Q3: 

Security Level を High に設定した状態で、 `users` テーブルから `user` カラムと `password` カラムを表示させてみましょう。

また、なぜ表示させることができたのかソースコードを使って説明してみましょう。

## CSRF


