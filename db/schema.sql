DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;


CREATE TABLE departments (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR
  (30) NOT NULL
);

CREATE TABLE roles (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
role_name VARCHAR (30),
salary INT,
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
);

CREATE TABLE employees (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR (30), last_name VARCHAR (30),
role_id INT, manager_id INT, FOREIGN KEY (manager_id) REFERENCES employees (id),
FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE );

 -- displays formatted table with only relevant info
 SELECT e.first_name, e.last_name, r.role_name, r.salary, e.manager_id, m.first_name AS manager_firstname, m.last_name AS manager_lastname, r.department_id FROM employee_db.employees e INNER JOIN employee_db.employees m ON e.manager_id = m.id INNER JOIN employee_db.roles r ON e.role_id = r.id INNER JOIN employee_db.departments d ON r.department_id = d.id




