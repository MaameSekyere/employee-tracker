DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;


CREATE TABLE departments (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR
  (30) NOT NULL
);

INSERT INTO departments
    (department_name)
  VALUES
    ("Engineering"),
    ("Sales"),
    ("Maintenance"),
    ("Accounting");

