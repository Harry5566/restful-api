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
    message: "已獲取所有使用者",
  });
});

// 獲取特定 ID 的使用者
app.get("/api/users/:id", (req, res) => {
  // 路由參數
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id }, // {id: id}(不省略版),
    message: `已獲取 ${id} 使用者`,
  });
});

// 新增一個使用者
app.post("/api/users", (req, res) => {
  res.status(201).json({
    status: "success",
    data: {},
    message: "新增一個使用者 成功",
  });
});

// 更新(特定 ID)的使用者
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "更新一個使用者 成功",
  });
});

// 刪除(特定 ID)使用者
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "刪除一個使用者 成功",
  });
});

// 搜尋使用者
app.get("/api/users/search", (req, res) => {
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
  });
});

// 使用者登入
app.post("/api/users/login", upload.none(), (req, res) => {
  const { account, password } = req.body;
  res.status(200).json({
    status: "success",
    data: "token",
  });
});

// 使用者登出
app.post("/api/users/logout", checkToken, (req, res) => {
  res.status(200).json({
    status: "success",
    data: "token",
  });
});

// 檢查登入狀態
app.post("/api/users/status", checkToken, (req, res) => {
  res.status(200).json({
    status: "success",
    data: "token",
  });
});

app.listen(3005, () => {
  console.log("主機啟動 http://localhost:3005");
});

function checkToken(req, res, next) {
  next();
}
