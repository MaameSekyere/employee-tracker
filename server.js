const inquirer = require("inquirer");
const cTable = require("console.table");
const promiseMysql = require("promise-mysql");

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
        "View Employees By Department",
        "View Department Budgets",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Remove Employee",
        "Remove Role",
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

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "View Employees By Department":
          viewEmployeesByDepartment();
          break;

        case "View Department Budgets":
          viewDepartmentBudget();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Exit":
          exitApp();

        default:
          break;
      }
    });
}
