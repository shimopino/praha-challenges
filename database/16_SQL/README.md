# 課題16「SQL10本ノック」

<!-- START doctoc -->
<!-- END doctoc -->

## 課題1

課題は [Web SQL](https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all) で実行する。

### 問題1

```sql
SELECT  CustomerID
       ,COUNT(CustomerID) AS CustomerCOUNT
FROM orders
-- WHEREにはDate型の場合の指定方法も試してみる
-- WHERE strftime('%Y', OrderDate) = '1996'
WHERE OrderDate LIKE "1996%"
GROUP BY CustomerID
HAVING COUNT(CustomerID) >= 3
ORDER BY CustomerCOUNT DESC
```

### 問題2

```sql
SELECT  OrderID
       ,COUNT(*)
FROM OrderDetails
GROUP BY  OrderID
HAVING COUNT(OrderID) = (
    SELECT  MAX(OrderCount)
    FROM (
    	SELECT  OrderID
	           ,COUNT(OrderID) AS OrderCount
    	FROM OrderDetails
	    GROUP BY  OrderID 
    )
)
```

### 問題3

```sql
SELECT  shipperId
       ,COUNT(ShipperId)
FROM orders
GROUP BY  ShipperId
HAVING COUNT(shipperId) = (
    SELECT  MAX(ShipperCount)
    FROM (
    	SELECT  shipperId
	           ,COUNT(ShipperId) AS ShipperCount
        FROM orders
        GROUP BY  shipperId 
    )
)
```

### 問題4

```sql

```