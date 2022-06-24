INSERT INTO department
    (department_name)
  VALUES
    ("Engineering"),
    ("Sales"),
    ("Maintenance"),
    ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("Senior Engineer", 150000, 1),
      ("Intern", 30000, 1),
      ("Salesperson", 35000, 2),
      ("Attourney", 50000, 3),
      ("Accountant", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
        ("Maame", "Sekyere", 1),
        (),
        ("Sylvia", "Ayisi", 4),
        ("Jeff", "Owusu", 3),
        ('Lina', 'Wilson',2,NULL),
        ('David', 'Green',4,4),
        ('Taylor', 'Moore',3,NUll);
