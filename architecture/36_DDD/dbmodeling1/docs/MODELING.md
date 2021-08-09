<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [DB モデリング](#db-%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
  - [Prisma によるモデリング](#prisma-%E3%81%AB%E3%82%88%E3%82%8B%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0)
    - [税マスタ](#%E7%A8%8E%E3%83%9E%E3%82%B9%E3%82%BF)
    - [顧客マスタ](#%E9%A1%A7%E5%AE%A2%E3%83%9E%E3%82%B9%E3%82%BF)
    - [商品マスタ](#%E5%95%86%E5%93%81%E3%83%9E%E3%82%B9%E3%82%BF)

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

初期データ投入用の [`prisma/seed.ts`](../prisma/seed.ts) を作成する。

作成した後は下記のコマンドを使用してデータを投入する。

```bash
# マイグレーションを実行する
npm run migrate:dev

# 下記コマンドを実行すれば、データ投入結果が確認できる
npm run migrate:test

Running seed: ts-node --compiler-options "{\"module\":\"commonjs\"}" "prisma/seed.ts" ...
seeding 1 : 通常税率
seeding 2 : 軽減税率
seeding 3 : 非課税
seeding succeed ...
```

実際にデータが投入されていることを確認する。

```bash
# コンテナ内の Postgres にアクセスする
docker container exec -it prisma-test-db psql -U test prisma

# Postgres 内で作成されているテーブルを確認する
prisma=# \dt
>
              List of relations
 Schema |        Name        | Type  | Owner
--------+--------------------+-------+-------
 public | _prisma_migrations | table | test
 public | customer           | table | test
 public | item               | table | test
 public | item_category      | table | test
 public | order              | table | test
 public | order_detail       | table | test
 public | set_item_component | table | test
 public | tax_category       | table | test
 public | tax_rate_range     | table | test
(9 rows)

prisma=# select * from tax_category;
 id | taxCategoryName
----+-----------------
  1 | 通常税率
  2 | 軽減税率
  3 | 非課税
(3 rows)

prisma=# select * from tax_rate_range;
 id | appliedStateDate | appliedEndDate | taxCategoryId | taxRate
----+------------------+----------------+---------------+---------
  1 | 1900-01-01       | 1989-03-31     |             1 |       1
  2 | 1989-04-01       | 1997-03-31     |             1 |    1.03
  3 | 1997-04-01       | 2014-03-31     |             1 |    1.05
  4 | 2014-04-01       | 2019-09-30     |             1 |    1.08
  5 | 2019-10-01       | 2099-12-31     |             1 |     1.1
  6 | 1900-01-01       | 1989-03-31     |             2 |       1
  7 | 1989-04-01       | 1997-03-31     |             2 |       1
  8 | 1997-04-01       | 2014-03-31     |             2 |       1
  9 | 2014-04-01       | 2019-09-30     |             2 |       1
 10 | 2019-10-01       | 2099-12-31     |             2 |    1.08
 11 | 1900-01-01       | 1989-03-31     |             3 |       1
 12 | 1989-04-01       | 1997-03-31     |             3 |       1
 13 | 1997-04-01       | 2014-03-31     |             3 |       1
 14 | 2014-04-01       | 2019-09-30     |             3 |       1
 15 | 2019-10-01       | 2099-12-31     |             3 |       1
(15 rows)
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

### 商品マスタ

次に **商品マスタ** を考える。

- セット商品構成に関して、複合主キーで考える
  - そのため同じテーブルに対する外部キー制約が発生する
  - 制約上、外部キー制約の名称を分けておく必要がある
    - `SetItem` と `ComponentItem`

```prisma
// 商品
model Item {
  // アプリケーション側の UUID で生成する
  id             String             @id
  itemName       String
  // 以下は　Postgres の場合は decimal(65,30) にマッピングされる
  // @db.Decimal(X, Y) でも指定することができる
  normalPrice    Decimal
  category       ItemCategory       @relation(fields: [categoryId], references: [id])
  categoryId     String
  taxCategory    TaxCategory        @relation(fields: [taxCategoryId], references: [id])
  taxCategoryId  Int
  // セット商品区分
  isSetItem      Boolean
  orderDetails   OrderDetail[]
  setItems       SetItemComponent[] @relation("SetItem")
  ComponentItems SetItemComponent[] @relation("ComponentItem")

  @@map("item")
}

// 商品カテゴリ
model ItemCategory {
  // アプリケーション側の UUID で生成する
  id           String @id
  categoryName String
  items        Item[]

  @@map("item_category")
}

// セット商品構成
model SetItemComponent {
  setItem   Item   @relation(name: "SetItem", fields: [setItemId], references: [id])
  setItemId String
  item      Item   @relation(name: "ComponentItem", fields: [itemId], references: [id])
  itemId    String
  count     Int

  @@unique([setItemId, itemId], name: "SetItemComponent_unique_key")
  @@map("set_item_component")
}
```

### 注文管理

次に **注文管理** を考える。

- 主キーは同様にアプリケーション側で生成する

```prisma
// 注文
model Order {
  id            String        @id
  // One-to-Many の関係
  customer      Customer      @relation(fields: [customerId], references: [id])
  customerId    String
  // One-to-Many の関係
  orderDetails  OrderDetail[]
  // DateTime は ISO-8601 のフォーマットに従っている
  // 以下は Postgres の場合は @db.Timestamp(3) にマッピングされる
  // 括弧の中は小数点以下の秒数 (ミリ秒など) をあらわす
  orderDate     DateTime
  customerName  String
  customerPhone String
  isPayed       Boolean

  @@map("order")
}

// 注文明細
model OrderDetail {
  order          Order   @relation(fields: [orderId], references: [id])
  orderId        String
  item           Item    @relation(fields: [itemId], references: [id])
  itemId         String
  count          Int
  appliedTaxRate Float
  appliedPrice   Decimal
  containWasabi  Boolean

  @@unique([orderId, itemId], name: "OrderDetail_unique_key")
  @@map("order_detail")
}
```
