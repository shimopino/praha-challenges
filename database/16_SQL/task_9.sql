UPDATE customers
SET customerName = NULL
WHERE customerID = 1 

SELECT CustomerID, CustomerName
FROM Customers
WHERE CustomerName IS NOT NULL

SELECT CustomerID, CustomerName
FROM Customers
WHERE CustomerName IS NULL
