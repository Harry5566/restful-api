import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "restful",
});

// const [results] = await connection.execute("SELECT * FROM users");

// console.log(results);

// const [result] = await connection.execute(
//   "SELECT * FROM `users` WHERE `account` = ?",
//   ["ben"]
// );

// console.log(result);

const result = await connection
  .execute("SELECT * FROM `users` WHERE `account` = ?", ["ben"])
  .then(([result]) => {
    return result[0];
  });

console.log(result);
