SELECT O.orderID
      ,O.EmployeeID
      ,MAX(O.OrderDate) AS MaxOrderDate
FROM orders O
INNER JOIN employees E ON E.employeeID = O.employeeID
GROUP BY O.EmployeeID