INSERT INTO departments
    (department_name)
  VALUES
    ("Engineering"),
    ("Sales"),
    ("Maintenance"),
    ("Accounting");

INSERT INTO roles (role_name, salary, department_id)
VALUES ("Senior Engineer", 50000, 1),
      ("Intern", 30000, 1),
      ("Salesperson", 35000, 2),
      ("Attourney", 50000, 3),
      ("Accountant", 60000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
        ("Maame", "Sekyere", 1),
        (),
        ("Sylvia", "Ayisi", 4),
        ("Jeff", "Owusu", 3);
