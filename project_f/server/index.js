// 測試.env是否有抓取到
// console.log(process.env.JWT_SECRET_KEY);
import express, { json } from "express";
import multer from "multer";
import cors from "cors";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// 設定區
const upload = multer();
let whitelist = ["http://localhost:5500", "http://localhost:3000"];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// 路由區
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("首頁");
});

// 獲取所有使用者
app.get("/api/users", (req, res) => {
  res.status(200).json({
    status: "success",
    data: [],
  });
});

// 獲取特定 ID 的使用者
app.get("/api/users/:id", (req, res) => {
  // 路由參數
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id }, // {id: id}(不省略版),
  });
});

// 新增一個使用者
app.post("/api/users", (req, res) => {
  res.status(201),
    json({
      status: "success",
      data: {},
    });
});

// 更新(特定 ID)的使用者
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
  });
});

// 刪除(特定 ID)使用者
app.delete("/api/user/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
  });
});

app.listen(3005, () => {
  console.log("主機啟動 http://localhost:3005");
});
