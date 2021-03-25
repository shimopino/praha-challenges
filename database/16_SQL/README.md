# 課題16「SQL10本ノック」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
  - [問題1](#%E5%95%8F%E9%A1%8C1)
  - [問題2](#%E5%95%8F%E9%A1%8C2)
  - [問題3](#%E5%95%8F%E9%A1%8C3)
  - [問題4](#%E5%95%8F%E9%A1%8C4)
  - [問題5](#%E5%95%8F%E9%A1%8C5)
  - [問題6](#%E5%95%8F%E9%A1%8C6)
  - [問題7](#%E5%95%8F%E9%A1%8C7)
  - [問題8](#%E5%95%8F%E9%A1%8C8)
  - [問題9](#%E5%95%8F%E9%A1%8C9)
  - [問題10](#%E5%95%8F%E9%A1%8C10)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
  - [問題1](#%E5%95%8F%E9%A1%8C1-1)
  - [問題2](#%E5%95%8F%E9%A1%8C2-1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

> なぜNULLのレコードを「SELECT * FROM Customers WHERE CustomerName = NULL;」で取得することができないのか

SQLでは真偽値を **3値論理** として扱っており、true/false/unknown の3種類を有している。

`WHERE` 句を使用してレコードを絞り込んだ場合、評価が `true` になるレコードが抽出される。しかし、`NULL` ではどのような比較演算子を使用したとして評価結果が `unknown` になってしまうため、`IS NULL` を使用する必要がある。

### 問題10

```sql
-- 該当のレコードを削除
DELETE FROM employees
WHERE EmployeeID = '1' 

-- EmployeesテーブルのNULLも表示する
SELECT  O.EmployeeID AS OrderEmployeeID 
       ,E.EmployeeID AS EmployeeID
FROM orders O
LEFT JOIN employees E ON E.employeeID = O.employeeID

-- 等価結合で互いに一致するものだけを表示する
SELECT  O.EmployeeID AS OrderEmployeeID 
       ,E.EmployeeID AS EmployeeID
FROM orders O
JOIN employees E ON E.employeeID = O.employeeID
```

## 課題2

### 問題1

それぞれのSQLコマンドの役割を考える。

- WHERE
  - GROUP BYで集約させたテーブルに対して、1つ1つの行に対する条件指定を追加する
- HAVING
  - GROUP BYで集約させたテーブルに対して、グループ自体に対する条件指定を追加する

実行速度を考えた場合は「WHERE」句を使用する。

### 問題2

| 名称                                  | 概要                                                                                                | コマンド例                                                           | 
| ------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | 
| DDL<br>(Data Definition Language)     | DBスキーマを定義するためのSQLコマンド<br><br>DB内のテーブルなどのオブジェクトを操作することができる | ・CREATE<br>・DROP<br>・ALTER<br>・TRUNCATE<br>・COMMENT<br>・RENAME | 
| DML<br>(Data Manipulation Language)   | DB内に存在しているデータを操作するためのSQLコマンド<br>                                             | ・INSERT<br>・UPDATE<br>・DELETE                                     | 
| DCL<br>(Data Control Language)        | DBシステムの権限やロールなどを管理するためのコマンド                                                | ・GRANT<br>・REVOKE                                                  | 
| TCL<br>(Transaction Control Language) | DB内のトランザクションを管理するためのコマンド                                                      | ・COMMIT<br>・ROLLBACK<br>・SAVEPOINT<br>・SET TRANSACTION           | 

以下の図がわかりやすかった。

![](https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190826175059/Types-of-SQL-Commands-1024x884.jpg)

> GeeksForGeeks
> https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/
