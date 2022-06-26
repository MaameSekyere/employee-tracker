INSERT INTO department
    (department_name)
  VALUES
    ("Engineering"),
    ("Sales"),
    ("Legal"),
    ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("Senior Engineer", 150000, 1),
      ("Intern", 30000, 1),
      ("Salesperson", 35000, 2),
      ("Attourney", 50000, 3),
      ("Accountant", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Maame', 'Sanchez',1,1),
('John', 'Smith',4,NULL),
('Kofi', 'Chen',2,NULL),
('Maria', 'Amo',2,3),
('Lina', 'Wilson',6,NULL),
('Koo', 'Green',5,5),
('Ama', 'Moore',3,NUll);
