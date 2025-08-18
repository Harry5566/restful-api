import jwt from "jsonwebtoken";
// const secretKey = "bennnn";
// import dotenv from "dotenv";
// dotenv.config();

// console.log();

const token = jwt.sign(
  {
    userName: "Ben Chen",
    email: "ben@ben.com",
    head: "ben.jpg",
    note: "命令參數的使用",
  },
  process.argv[2]

);

console.log(token);
