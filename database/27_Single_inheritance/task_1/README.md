# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [問題設定](#%E5%95%8F%E9%A1%8C%E8%A8%AD%E5%AE%9A)
  - [課題1 ｌ](#%E8%AA%B2%E9%A1%8C1-%EF%BD%8C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 問題設定

問題の詳細は [airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recs0SLG3aI2wTeWi?blocks=hide) を確認する。

以下のテーブル設計でどのような課題が発生するのか見ていく。

```sql
CREATE TABLE IF NOT EXISTS Contract (
    new_conster_id INT PRIMARY KEY,
    telephone BOOLEAN,  -- 電話を掛けたらTRUE
    metOnce BOOLEAN,    -- アポで面談したらTRUE
    metAt DATE,         -- アポで面談した日付
    chosed BOOLEAN,     -- 成約したらTRUE
    chosedAt DATE       -- 成約した日付
) ENGINE=InnoDB;
```

### 課題1 NULLが入り込む設計となる

顧客に対する全ての営業イベントが必ずはっせいするわけではないため、例えば成約できなかった場合や、アポイントが取れなかった場合に以下のように多くの `NULL` が入り込む設計となってしまう。

```bash
| new_customer_id | telephone | metOnce | metAt      | chosed | chosedAt   |
| --------------- | --------- | ------- | ---------- | ------ | ---------- |
| 1               | TRUE      | TRUE    | 2021-04-01 | TRUE   | 2021-04-05 |
| 2               | TRUE      | TRUE    | 2021-04-10 | FALSE  |            |
| 3               | FALSE     | FALSE   |            | FASLE  |            |
```

`NULL` が入り込んでしまうと、例えばアポイントで面談した日付順で昇順ソートしようとした場合に、RDBMSによっては `NULL` の日付が1レコード目として抽出できてしまったりと、バグが入り込んでしまう可能性が高まってしまう。

### 課題2 顧客と各イベントが1対1に紐づいてしまう

例えばある顧客に対して、2回のアポイントをとって面談した場合、過去の面談日程を更新して上書きする必要があるため、過去の営業イベント情報を保持することができなくなってしまう。

```bash
| new_customer_id | telephone | metOnce | metAt      | chosed | chosedAt   |
| --------------- | --------- | ------- | ---------- | ------ | ---------- |
| 1               | TRUE      | TRUE    | 2021-04-01 | FALSE  |            |

                                              ↓ # 1回目のデータが消える

| new_customer_id | telephone | metOnce | metAt      | chosed | chosedAt   |
| --------------- | --------- | ------- | ---------- | ------ | ---------- |
| 1               | TRUE      | TRUE    | 2021-04-05 | FALSE  |            |
```

もしも複数回面談が実施された場合の記録も保持したい場合には、新たに `metTwice` や `metTwiceAt` などのカラムを追加する必要がある。

そのため、仕様として面談回数の上限値を事前に設定することができない場合、将来的にテーブル定義を変更せざるを得ない状況が発生してしまう。
