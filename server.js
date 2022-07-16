const inquirer = require("inquirer");
const db = require("./db/connection");
const promiseMysql = require("promise-mysql");

const connectInfo = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Nollyjemzz1",
  database: "employee_db",
};

db.connect((err) => {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  postConnection();
});

postConnection = () => {
  console.log(
    "******************WELCOME TO EMPLOYEE TRACKER***********************"
  );
  questions();
};

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
  var sql = `SELECT employee.id,
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
      db.query(roleSql, (error, data) => {
        if (error) throw error;
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
            db.query(managerSql, (error, data) => {
              if (error) throw error;
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
                  db.query(sql, empNames, (error) => {
                    if (error) throw error;
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
  db.query(`SELECT * FROM roles`, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      return;
    }

    let roleArray = [];

    results.forEach((item) => {
      roleArray.push(item.title);
    });
    db.query(
      `SELECT first_name, last_name FROM employee`,
      function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }

        let nameArray = [];
        results.forEach((item) => {
          nameArray.push(item.first_name);
          nameArray.push(item.last_name);
        });
        let allNamesArr = [];
        for (let i = 0; i < nameArray.length; i += 2) {
          if (!nameArray[i + 1]) break;
          allNamesArray.push(`${nameArray[i]} ${nameArray[i + 1]}`);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "name_select",
              message: "Please select an employee you would like to update",
              choices: allNamesArr,
            },
            {
              type: "list",
              name: "role_select",
              message:
                "Please select a role you would like your employee to change to:",
              choices: roleArray,
            },
          ])
          .then((data) => {
            let role_id;
            for (let i = 0; i < roleArray.length; i++) {
              if (data.role_select === roleArray[i]) {
                role_id = i + 1;
              }
            }
            let selectedNameArray = data.name_select.split(" ");
            let last_name = selectedNameArray.pop();
            let first_name = selectedNameArray[0];

            db.query(
              `UPDATE employee 
                                    SET role_id = ?
                                    WHERE first_name = ? AND last_name = ?`,
              [role_id, first_name, last_name],
              function (err, results, fields) {
                if (err) {
                  console.log(err.message);
                  return;
                }
                console.log("Employee updated!");
                questions();
              }
            );
          });
      }
    );
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "text",
      name: "dep_name",
      message:
        "Please enter the name of the department you would like to add: ",
    })
    .then((data) => {
      db.query(
        `INSERT INTO department (department_name)
                VALUES(?)`,
        [data.dep_name],
        function (err, results, fields) {
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
  let departmentArr = [];

  promiseMysql
    .createConnection(connectInfo)
    .then((cone) => {
      return cone.query(`SELECT * FROM department `);
    })
    .then((departments) => {
      for (i = 0; i < departments.length; i++) {
        departmentArr.push(departments[i].department_name);
      }

      return departments;
    })
    .then((departments) => {
      inquirer
        .prompt([
          {
            name: "roleTitle",
            type: "input",
            message: "What is new role title?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of new title?",
          },
          {
            name: "dept",
            type: "list",
            message: "which department does new title belong to ?",
            choices: departmentArr,
          },
        ])
        .then((answer) => {
          let dept_id;

          for (i = 0; i < departments.length; i++) {
            if (answer.dept == departments[i].department_name) {
              dept_id = departments[i].id;
            }
          }

          db.query(
            `INSERT INTO roles(title,salary,department_id) 
            VALUES( "${answer.roleTitle}",${answer.salary},${dept_id})`,
            (err, res) => {
              if (err) throw err;
              console.log(`\n Role ${answer.roleTitle} is added . \n`);
              questions();
            }
          );
        });
    });
}

function exitApp() {
  db.end();
}
