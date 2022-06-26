const inquirer = require("inquirer");
const db = require("./db/connection");

// cTable = require("console.table");
//const promiseMysql = require("promise-mysql");

db.connect((err) => {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  afterConnection();
});

afterConnection = () => {
  console.log("*****************************************");
  console.log("*                                       *");
  console.log("*              EMPLOYEE                 *");
  console.log("*              TRACKER                  *");
  console.log("*                                       *");
  console.log("*****************************************");
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

        case "Exit":
          exitApp();

        default:
          break;
      }
    });
}

function viewAllEmployees() {
  let sql = `SELECT employee.id,
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
    console.log("All department : ");
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
      const crit = [answer.first_name, answer.last_name];
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
            crit.push(role);
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
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  db.query(sql, crit, (error) => {
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
  // Select all roles from table for future ref
  connection.query(`SELECT * FROM roles`, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      return;
    }

    // Create empty array for storing info
    let roleArr = [];

    // for each item in the results array, push the name of the roles to the roles array
    results.forEach((item) => {
      roleArr.push(item.title);
    });
    connection.query(
      `SELECT first_name, last_name FROM employee`,
      function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }

        let nameArr = [];
        results.forEach((item) => {
          nameArr.push(item.first_name);
          nameArr.push(item.last_name);
        });
        let combinedNameArr = [];
        for (let i = 0; i < nameArr.length; i += 2) {
          if (!nameArr[i + 1]) break;
          combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "name_select",
              message: "Please select an employee you would like to update",
              choices: combinedNameArr,
            },
            {
              type: "list",
              name: "role_select",
              message:
                "Please select a role you would like your employee to change to:",
              choices: roleArr,
            },
          ])
          .then((data) => {
            let role_id;
            for (let i = 0; i < roleArr.length; i++) {
              if (data.role_select === roleArr[i]) {
                role_id = i + 1;
              }
            }
            let selectedNameArr = data.name_select.split(" ");
            let last_name = selectedNameArr.pop();
            let first_name = selectedNameArr[0];

            connection.query(
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

function exitApp() {
  db.end();
}
