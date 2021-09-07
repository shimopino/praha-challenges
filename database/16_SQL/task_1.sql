SELECT  CustomerID
       ,COUNT(CustomerID) AS CustomerCOUNT
FROM orders
WHERE OrderDate LIKE "1996%" 
GROUP BY CustomerID
HAVING COUNT(CustomerID) >= 3
ORDER BY CustomerCOUNT DESC