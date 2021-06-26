SELECT  C.Country
       ,ROUND(SUM(OD.quantity * P.price)) AS SALES
FROM orderdetails OD
INNER JOIN products P ON P.productID = OD.productID
INNER JOIN orders O ON O.orderID = OD.orderID
INNER JOIN customers C ON C.customerID = O.customerID
GROUP BY  C.Country
ORDER BY sales desc