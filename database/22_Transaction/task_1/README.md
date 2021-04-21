# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [デッドロックとは何か](#%E3%83%87%E3%83%83%E3%83%89%E3%83%AD%E3%83%83%E3%82%AF%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [ISOLATION LEVELとは何か](#isolation-level%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [行レベルロック、テーブルレベルロックの違いとは何か](#%E8%A1%8C%E3%83%AC%E3%83%99%E3%83%AB%E3%83%AD%E3%83%83%E3%82%AF%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E3%83%AC%E3%83%99%E3%83%AB%E3%83%AD%E3%83%83%E3%82%AF%E3%81%AE%E9%81%95%E3%81%84%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
- [悲観ロックと楽観ロックの違いは何か](#%E6%82%B2%E8%A6%B3%E3%83%AD%E3%83%83%E3%82%AF%E3%81%A8%E6%A5%BD%E8%A6%B3%E3%83%AD%E3%83%83%E3%82%AF%E3%81%AE%E9%81%95%E3%81%84%E3%81%AF%E4%BD%95%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## デッドロックとは何か

デッドロックとは、2つ以上のトランザクションがお互いが必要としているデータを取得するために、お互いのリソースが解放されるのを待機している状況である。



## ISOLATION LEVELとは何か

## 行レベルロック、テーブルレベルロックの違いとは何か

## 悲観ロックと楽観ロックの違いは何か


## ACIDモデル

**ACIDモデル** とは、ビジネスデータやアプリケーションにとって重要となる **信頼性** の側面を重視したデータベースの設計原則である。

連続する複数の操作が

参考資料

- [15.2 InnoDB and the ACID Model](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html)

### Atomicity (原子性)



### Consistency (一貫性)

### Isolation (独立性)

### Durability (耐久性)

## ロックの種類

### 共有ロックと占有ロック

InnoDBでは行レベルのロックとして **共有ロック (S)** と **占有ロック (X)** を実装している。

共有ロックは read lock とも呼ばれており、名前の通りテーブルからレコードをSELECT文で読み取るときに使用するロックである。

占有ロックは write lock とも呼ばれており、名前の通りテーブルから読み取ったレコードに対して更新や削除を行うときに使用するロックである。

とあるトランザクション T1 が行に対してロックを取得しているとき、ほかのトランザクション T2 が同じ行に対して取得できるロックは以下の組み合わせで表現できる。

|       |   S   |   X   |
| :---: | :---: | :---: |
|   S   |  Yes  |  No   |
|   X   |  No   |  No   |

つまりトランザクション T1 が共有ロックを取得している場合にのみ、ほかのトランザクション T2 は同じ行に対して共有ロックのみを取得することができる。

### Intention Locks

