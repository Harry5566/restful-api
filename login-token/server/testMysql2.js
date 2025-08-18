import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "restful",
});

// 方法 1
// const results = await connection.execute(
//   'SELECT * FROM users'
// );

// console.log(results[0]);

// 方法 2
// const [result] = await connection.execute(
//   'SELECT * FROM `users` WHERE `account` = ?',
//   ["ben"]
// );

// console.log(result);

// 方法 3
const result = await connection
  .execute("SELECT * FROM `users` WHERE `account` = ?", ["ben"])
  .then(([result]) => {
    return result[0];
  });

console.log(result);
