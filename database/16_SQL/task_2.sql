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