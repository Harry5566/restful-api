import jwt from "jsonwebtoken";
// const secretKey = "bennnn";
// import dotenv from "dotenv";
// dotenv.config();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkJlbiBDaGVuIiwiZW1haWwiOiJiZW5AYmVuLmNvbSIsImhlYWQiOiJiZW4uanBnIiwibm90ZSI6IuWRveS7pOWPg-aVuOeahOS9v-eUqCIsImlhdCI6MTc1NTQ4MjE4MX0.aLCqbfhKxumUSRQvhw2LbbU1QE1fNXWXj4f2uXgRYSU";

jwt.verify(token, process.argv[2], (error, data) => {
  if (error) return console.log(error);
  console.log(data);
});
