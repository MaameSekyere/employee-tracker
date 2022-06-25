const mysql = require("mysql2");

const connectInfo = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Nollyjemzz1",
  database: "employee_db",
};

const db = mysql.createConnection(connectInfo);

module.exports = db;
