# 課題4

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [物理設計](#%E7%89%A9%E7%90%86%E8%A8%AD%E8%A8%88)
- [サンプルデータ](#%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
-- Customer
INSERT INTO Customer (id, name, phone) VALUES (1,'John', '080-0000-0000');
INSERT INTO Customer (id, name, phone) VALUES (2,'Mike', '080-0000-1234');
INSERT INTO Customer (id, name, phone) VALUES (3,'Bob', '080-1234-0000');

-- TaxCategory
INSERT INTO TaxCategory (id, tax_category_name) VALUES (1,'normal tax');
INSERT INTO TaxCategory (id, tax_category_name) VALUES (2,'reduced tax');
INSERT INTO TaxCategory (id, tax_category_name) VALUES (3,'tax free');

-- TaxRate
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (1,'1900/01/01','1989/03/31','1','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (2,'1900/01/01','1989/03/31','2','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (3,'1900/01/01','1989/03/31','3','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (4,'1989/04/01','1997/03/31','1','3');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (5,'1989/04/01','1997/03/31','2','3');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (6,'1989/04/01','1997/03/31','3','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (7,'1997/04/01','2014/03/31','1','5');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (8,'1997/04/01','2014/03/31','2','5');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (9,'1997/04/01','2014/03/31','3','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (10,'2014/04/01','2019/09/30','1','8');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (11,'2014/04/01','2019/09/30','2','8');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (12,'2014/04/01','2019/09/30','3','0');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (13,'2019/10/01','2099/12/31','1','10');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (14,'2019/10/01','2099/12/31','2','8');
INSERT INTO TaxRate (id, start_date, last_date, tax_category_id, tax_rate) VALUES (15,'2019/10/01','2099/12/31','3','0');

-- ItemCategory
INSERT INTO ItemCategory (id, tax_category_name) VALUES (1,'100');
INSERT INTO ItemCategory (id, tax_category_name) VALUES (2,'150');
INSERT INTO ItemCategory (id, tax_category_name) VALUES (3,'180');


```

