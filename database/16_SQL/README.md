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
SELECT  ROUND(SUM(OD.quantity * P.price)) AS SALES
       ,C.Country
FROM orderdetails OD
INNER JOIN products P ON P.productID = OD.productID
INNER JOIN orders O ON O.orderID = OD.orderID
INNER JOIN customers C ON C.customerID = O.customerID
GROUP BY  C.Country
ORDER BY sales desc
```

### 問題5

```sql
SELECT ROUND(SUM(OD.quantity * P.price)) AS SALES
	  ,strftime('%Y', DATE(OrderDate)) AS OrderYear
      ,C.Country
FROM orderdetails OD
INNER JOIN products P ON P.productID = OD.productID
INNER JOIN orders O ON O.orderID = OD.orderID
INNER JOIN customers C ON C.customerID = O.customerID
GROUP BY C.Country, strftime('%Y', DATE(OrderDate))
```

### 問題6

```sql
-- 「Junior」列の追加
ALTER TABLE employees
ADD junior boolean

-- 「Junior」列を条件付で更新する
UPDATE employees
SET junior = 
CASE WHEN BirthDate > DATE('1961-01-01')
THEN
    True
ELSE
    False
END

-- 「Junior」列が更新されたことを確認する
SELECT * FROM employees
```

### 問題7

```sql
-- 長期の関係のお客さんのフラグ列を追加
ALTER TABLE Shippers
ADD long_relation boolean

-- 70回以上取引のあるShipperのフラグを追加
update shippers
set long_relation = 
CASE WHEN ShipperID IN (
    select ShipperID from orders
    group by shipperID
    having count(*) >= 70
)
THEN
    True
ELSE
    False
END
```

### 問題8

```sql
SELECT O.orderID
      ,O.EmployeeID
      ,MAX(O.OrderDate) AS MaxOrderDate
FROM orders O
INNER JOIN employees E ON E.employeeID = O.employeeID
GROUP BY O.EmployeeID
```

### 問題9

```sql
-- 特定の顧客名をNULLで更新
UPDATE customers
SET customerName = NULL
WHERE customerID = 1 

-- 顧客名がNULLではないレコードを抽出
SELECT CustomerID, CustomerName
FROM Customers
WHERE CustomerName IS NOT NULL

-- 顧客名がNULLのレコードを抽出
SELECT CustomerID, CustomerName
FROM Customers
WHERE CustomerName IS NULL
```

### 問題10

## 課題2

| 名称                                  | 概要                                                                                                | コマンド例                                                           | 
| ------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | 
| DDL<br>(Data Definition Language)     | DBスキーマを定義するためのSQLコマンド<br><br>DB内のテーブルなどのオブジェクトを操作することができる | ・CREATE<br>・DROP<br>・ALTER<br>・TRUNCATE<br>・COMMENT<br>・RENAME | 
| DML<br>(Data Manipulation Language)   | DB内に存在しているデータを操作するためのSQLコマンド<br>                                             | ・INSERT<br>・UPDATE<br>・DELETE                                     | 
| DCL<br>(Data Control Language)        | DBシステムの権限やロールなどを管理するためのコマンド                                                | ・GRANT<br>・REVOKE                                                  | 
| TCL<br>(Transaction Control Language) | DB内のトランザクションを管理するためのコマンド                                                      | ・COMMIT<br>・ROLLBACK<br>・SAVEPOINT<br>・SET TRANSACTION           | 

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190826175059/Types-of-SQL-Commands-1024x884.jpg)

> GeeksForGeeks
> https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/
