const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
   acquireTimeout: 60000,
   timeout: 60000,
     ssl: {
    rejectUnauthorized: false  
  }
});
db.getConnection()
  .then((connection) => {
    console.log("Database Connected Successfully!!");
    connection.release();
  })
  .catch((err) => {
    console.log("Connection failed!!", err.message);
  });
module.exports = db;
