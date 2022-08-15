const inquirer = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  postConnection();
});

function postConnection() {
  console.log(
    "******************WELCOME TO EMPLOYEE TRACKER***********************"
  );
  questions();
}

function questions() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee role",
        "Exit",
      ],
    })
    .then((data) => {
      switch (data.choice) {
        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update Employee role":
          updateEmployeeRole();
          break;

        case "Exit":
          exitApp();

        default:
          break;
      }
    });
}

function viewAllEmployees() {
  const sql = `SELECT employee.id,
                        employee.first_name,
                        employee.last_name,
                        roles.title,
                        department.department_name AS department,
                        roles.salary,
                        CONCAT(manager.first_name, " ",manager.last_name) AS manager
                        FROM employee
                        LEFT JOIN roles ON employee.role_id = roles.id
                        LEFT JOIN department ON roles.department_id = department.id 
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, res) => {
    if (err) throw err;

    console.table(res);

    questions();
  });
}

function viewDepartments() {
  var query = `SELECT * FROM department`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

function viewAllRoles() {
  var query = `SELECT roles.id,roles.title,roles.salary,department.department_name
     FROM roles LEFT JOIN department ON roles.department_id = department.id`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      const empNames = [answer.first_name, answer.last_name];
      const roleSql = `SELECT roles.id, roles.title FROM roles`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            empNames.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  empNames.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;

                  db.query(sql, empNames, (err) => {
                    if (err) throw err;
                    console.log("Employee has been added!");

                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
}

function updateEmployeeRole() {
  const empSql = `SELECT * FROM employee`;

  db.query(empSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const updatedEmp = [];
        updatedEmp.push(employee);

        const managerSql = `SELECT * FROM employee`;

        db.query(managerSql, (err, data) => {
          if (err) throw err;

          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managers,
              },
            ])
            .then((managerChoice) => {
              const manager = managerChoice.manager;
              updatedEmp.push(manager);

              let employee = updatedEmp[0];
              updatedEmp[0] = manager;
              updatedEmp[1] = employee;

              const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

              db.query(sql, updatedEmp, (err) => {
                if (err) throw err;
                console.log("Employee has been updated!");

                viewAllEmployees();
              });
            });
        });
      });
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "text",
      name: "dep_name",
      message: "Please enter a department name: ",
    })
    .then((data) => {
      db.query(
        `INSERT INTO department (department_name)
                VALUES(?)`,
        [data.dep_name],
        function (err) {
          if (err) {
            console.log(err.message);
            return;
          }

          console.log("Added department!");
          questions();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role do you want to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please enter a role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
        validate: (addSalary) => {
          if (addSalary) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const newRole = [answer.role, answer.salary];

      const roleSql = `SELECT * FROM department`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this role in?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.dept;
            newRole.push(dept);

            const sql = `INSERT INTO roles(title,salary,department_id) 
            VALUES(?, ?, ?)`;

            db.query(sql, newRole, (err) => {
              if (err) throw err;
              console.log("Added" + answer.roleTitle + " to roles!");

              viewAllRoles();
            });
          });
      });
    });
}

function exitApp() {
  db.end();
}
