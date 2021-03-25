# 課題3 クイズ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [&#035;1 クイズ](#1-%E3%82%AF%E3%82%A4%E3%82%BA)
- [&#035;2 クイズ](#2-%E3%82%AF%E3%82%A4%E3%82%BA)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## #1 クイズ

課題1の問題7にて、自分の実装では新しくテーブルに列を追加して、そのあとで `UPDATE` 文を使用して注文回数が70回以上の `Shipper` にフラグ付けを行っていた。

上記の処理を `ALTER` や `UPDATE` などを使用せずに、`SELECT` 文を使用して、1回のクエリで表示するようにしてみましょう。

<details>
<summary>回答例</summary>

```sql
WITH
Shipper_Counter AS (
	SELECT ShipperID, COUNT(*) AS OrderCount
    FROM Orders
    GROUP BY ShipperID
)
select
	  *
     , CASE WHEN ShipperID IN (
        SELECT ShipperID
        FROM shipper_counter
        WHERE OrderCount >= 70
     ) THEN TRUE
     ELSE FALSE
     END AS GoodShipper
FROM orders
```

</details>

## #2 クイズ

商品のカテゴリごとに、いくつの商品が注文されたのか調べてみましょう。

これは `CategoryID` と `Quantity` を使用して計算することで求めることが可能です。

<details>
<summary>回答例</summary>

```sql
SELECT  CategoryID
       ,SUM(Quantity) QuantityPerCategory
FROM orderdetails OD
JOIN products P ON P.productID = OD.ProductID
GROUP BY CategoryID
```

</details>
