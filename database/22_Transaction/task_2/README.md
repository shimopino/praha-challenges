# 課題2

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題2](#課題2)
  - [トランザクション分離レベルの種類](#トランザクション分離レベルの種類)
  - [Dirty Read](#dirty-read)
    - [Concepts](#concepts)
    - [実演](#実演)
  - [Non-repeatable Read](#non-repeatable-read)
    - [Concepts](#concepts-1)
    - [実演](#実演-1)
  - [Phantom Read](#phantom-read)
    - [Concepts](#concepts-2)
    - [実演](#実演-2)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## トランザクション分離レベルの種類

トランザクションの分離レベルは4種類存在しているが、レコードの読み込み時に発生する問題に対して以下のように対応している。

| Isolation Level  | Dirty Read | Non-Repeatable Read | Phantom Read |
| :--------------: | :--------: | :-----------------: | :----------: |
| READ UNCOMMITTED |     O      |          O          |      O       |
|  READ COMMITTED  |     X      |          O          |      O       |
| REPEATABLE READ  |     X      |          O          |      O       |
|   SERIALIZABLE   |     X      |          X          |      X       |

## Dirty Read

### Concepts

**ダーティ・リード (Dirty Read)** は、コミットされていないトランザクションが書き込んだデータを、別のトランザクションが読み込んでしまう現象である。

![](../assets/dirty.png)

例えば上記の図では、トランザクションBが書き込んだ未コミット状態でのデータ `User B` を、別のトランザクションAが読み込んでしまっている。

その後、トランザクションBがロールバックされるとデータは `User A` に戻ってしまう。そうなると、トランザクションAは存在しないデータ `User B` を読み込んでしまったことになる。

### 実演

## Non-repeatable Read

### Concepts

**ノンリピータブル・リード (Non-Rpeatable Read)** は、同じトランザクション内で同じレコードを複数回読み込む間に、別のトランザクションによりコミットされたレコードを読み込んでしまい、同じトランザクション内でのレコードの読み込み結果が変化してしまう現象である。

![](../assets/non-repeatable.png)

例えば上記の図では、トランザクションAで同じレコードを2回取得しているが1回目では `User A` と読み取っており、2回目は他のトランザクションのコミットされたレコード `User B` を読み込んでしまっている。

### 実演

## Phantom Read

### Concepts

**ファントム・リード (Phantom Read)** は、同じトランザクション内で同じレコードを複数回読み込む間に、別のトランザクションによりレコードが追加・削除されてしまうことで、1回目と取得されるレコード数が変化してしまう現象である。

![](../assets/phantom.png)

例えば上記の図では、トランザクションAが1回目にレコードを取得した後で、別のトランザクションBがレコードを追加してしまい、
2回目のレコードが取得されたレコード数が増加してしまっている。

### 実演
