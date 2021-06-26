DELETE FROM employees
WHERE EmployeeID = '1' 

SELECT  O.EmployeeID AS OrderEmployeeID 
       ,E.EmployeeID AS EmployeeID
FROM orders O
LEFT JOIN employees E ON E.employeeID = O.employeeID

SELECT  O.EmployeeID AS OrderEmployeeID 
       ,E.EmployeeID AS EmployeeID
FROM orders O
JOIN employees E ON E.employeeID = O.employeeID