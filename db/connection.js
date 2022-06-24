const mysql = require("mysql2");

const connectInfo = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Nollyjemzz1",
  database: "employee_db",
};

const db = mysql.createConnection(connectInfo);

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
