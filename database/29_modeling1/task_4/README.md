# 課題4

<!-- START doctoc -->
<!-- END doctoc -->

## 物理設計

実際に課題3の論理設計をベースに、以下の挙動を再現できるのか検証する。

- メニュー一覧を表示する
  - カテゴリ
  - 商品名
  - 価格 (税抜き)
- 上記の一覧を税込み価格で表示する
  - 税率の適用基準は現在時刻とする

```sql
-- 顧客マスタ
CREATE TABLE IF NOT EXISTS Customer (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(255)
) ENGINE=InnoDB;

-- 消費税区分マスタ
CREATE TABLE IF NOT EXISTS TaxCategory (
    id INT PRIMARY KEY,
    tax_category_name VARCHAR(255)
) ENGINE=InnoDB;

-- 税率区分マスタ
CREATE TABLE IF NOT EXISTS TaxRate (
    id INT PRIMARY KEY,
    start_date date,
    last_date date,
    tax_category_id INT,
    tax_rate FLOAT,
    FOREIGN KEY (tax_category_id)
        REFERENCES TaxCategory(id)
) ENGINE=InnoDB;

-- 商品カテゴリマスタ
CREATE TABLE IF NOT EXISTS ItemCategory (
    id INT PRIMARY KEY,
    item_category_name VARCHAR(255)
) ENGINE=InnoDB;

-- 商品マスタ
CREATE TABLE IF NOT EXISTS Item (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price FLOAT,
    item_category_id INT,
    tax_category_id INT,
    is_set_item BOOLEAN,
    FOREIGN KEY (item_category_id)
        REFERENCES ItemCategory(id),
    FOREIGN KEY (tax_category_id)
        REFERENCES TaxCategory(id)
) ENGINE=InnoDB;

-- セット商品構成
CREATE TABLE IF NOT EXISTS SetItemComposition (
    id INT PRIMARY KEY,
    set_item_id INT,
    item_id INT,
    count FLOAT,
    FOREIGN KEY (set_item_id)
        REFERENCES Item(id),
    FOREIGN KEY (item_id)
        REFERENCES Item(id)
) ENGINE=InnoDB;

-- シャリ種別
CREATE TABLE IF NOT EXISTS ShariSize (
    id INT PRIMARY KEY,
    shari_size_name VARCHAR(255)
) ENGINE=InnoDB;

-- 受取方法
CREATE TABLE IF NOT EXISTS DeliveryMethod (
    id INT PRIMARY KEY,
    delivary_name VARCHAR(255)
) ENGINE=InnoDB;

-- 注文
CREATE TABLE IF NOT EXISTS SushiOrder (
    id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(255),
    paid BOOLEAN,
    delivary_method_id INT,
    FOREIGN KEY (customer_id)
        REFERENCES Customer(id),
    FOREIGN KEY (delivary_method_id)
        REFERENCES DeliveryMethod(id)
) ENGINE=InnoDB;

-- 注文明細
CREATE TABLE IF NOT EXISTS SushiOrderDetail (
    id INT PRIMARY KEY,
    order_id INT,
    item_id INT,
    is_wasabi BOOLEAN,
    applied_tax_rate FLOAT,
    shari_size_id INT,
    order_price FLOAT,
    FOREIGN KEY (order_id)
        REFERENCES SushiOrder(id),
    FOREIGN KEY (item_id)
        REFERENCES Item(id),
    FOREIGN KEY (shari_size_id)
        REFERENCES ShariSize(id)
) ENGINE=InnoDB;
```

## サンプルデータ

サンプルデータは [Google Spread Sheet](https://docs.google.com/spreadsheets/d/1ePLciL0BeTwNiJC_K4yfBLfe4ujrR_ecgttDUoCMdlE/edit?usp=sharing) を使用して作成した。

```sql

```

