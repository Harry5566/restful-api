// 測試.env是否有抓取到
// console.log(process.env.JWT_SECRET_KEY);
import express from "express";
import multer from "multer";
import cors from "cors";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// 設定區

// 路由區
const app = express();

app.get("/", (req, res) => {
  res.send("首頁");
});

app.listen(3005, () => {
  console.log("主機啟動 http://localhost:3005");
});
