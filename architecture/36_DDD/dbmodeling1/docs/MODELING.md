<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [DB モデリング](#db-%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
  - [Prisma によるモデリング](#prisma-%E3%81%AB%E3%82%88%E3%82%8B%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
    - [税マスタ](#%E7%A8%8E%E3%83%9E%E3%82%B9%E3%82%BF)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# DB モデリング

![](https://github.com/KeisukeShimokawa/praha-challenges/blob/feature/task29-issue-95/database/29_modeling1/assets/task_1/sushi-v2.png)

## Prisma によるモデリング

下記ではモデリングを行っていくが、文書には `npx prisma format` したものを載せる。

### 税マスタ

まずはほかのテーブルへの依存が少ない **税マスタ** から作成する。

以下の観点に注意してモデリングを実施する。

- 税マスタは、マイグレーション時に初期データの投入を行う
- 消費税区分
  - 初期データ投入なので、主キーは整数で与える
  - 区分は以下の 3 種類
    - 1: 通常税率
    - 2: 軽減税率
    - 3: 非課税
- 税率区分
  - 初期データ投入なので、主キーは整数で与える
  - 税率は `Float` 型で定義する

```prisma
// 消費税区分
model TaxCategory {
  // 種別なので [1, 2, 3] で定義する
  id              Int            @id
  taxCategoryName String
  // ある消費税率は、複数の適用期間に紐づく
  taxRateRanges   TaxRateRange[]
  // ある消費税率は、複数の商品に対して適用される可能性がある
  item            Item[]

  // SQL で確認できるように小文字のテーブル名にマッピングしておく
  @@map("tax_category")
}

// 税率区分
model TaxRateRange {
  // 10数個程度のレコードなので 整数 で定義する
  id               Int         @id
  appliedStateDate DateTime
  appliedEndDate   DateTime
  taxCategory      TaxCategory @relation(fields: [taxCategoryId], references: [id])
  taxCategoryId    Int
  taxRate          Float

  // SQL で確認できるように小文字のテーブル名にマッピングしておく
  @@map("tax_rate_range")
}
```

### 顧客マスタ

次に **顧客マスタ** を考える。

- 主キーはアプリケーション側で生成した `UUID` を使用する
  - [`nanoid`](https://www.npmjs.com/package/nanoid) を使用する
- 電話番号は被りがないように一意性制約を設ける

```prisma
// 顧客
model Customer {
  // アプリケーション側の UUID で生成する
  id     String  @id
  name   String
  phone  String  @unique
  orders Order[]

  @@map("customer")
}
```

