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