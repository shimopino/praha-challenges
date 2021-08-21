ALTER TABLE employees
ADD junior boolean

UPDATE employees
SET junior = 
CASE WHEN BirthDate > DATE('1961-01-01')
THEN
    True
ELSE
    False
END

SELECT * FROM employees