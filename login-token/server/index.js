import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import users from "./user.js";

const secretKey = process.env.SECRET_KEY;

const upload = multer();

const whitList = ["http://localhost:3005", "http://127.0.0.1:3005"];
const corsOptions = {
  credentials: true,
  origin(origin, cb) {
    if (!origin || whitList.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("不允許傳遞資料"));
    }
  },
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("首頁");
});

app.post("/api/users/login", upload.none(), (req, res) => {
  const { account, password } = req.body;
  const user = users.find(
    (u) => u.account == account && u.password == password
  );
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "帳號或密碼錯誤",
    });
  }
  const token = jwt.sign(
    {
      account: user.account,
      name: user.name,
      mail: user.mail,
      head: user.head,
    },
    secretKey,
    { expiresIn: "30m" }
  );

  res.status(200).json({
    status: "success",
    message: "登入成功",
    data: token,
  });
});

app.post("/api/users/logout", (req, res) => {
  const token = req.get("Authorization");
  console.log(token);

  res.status(200).json({ message: "登出成功" });
});

app.post("/api/users/status", (req, res) => {
  res.status(200).json({ message: "狀態: 登入" });
});

app.listen(3000, () => {
  console.log("主機已啟動於 http://localhost:3000");
});
