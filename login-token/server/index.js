import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import users from "./user.js";

const secretKey = process.env.SECRET_KEY;

const upload = multer();

const whiteList = [
  "http://localhost:3000",
  "http://localhost:3005",
  "http://127.0.0.1:3005",
];
const corsOptions = {
  credentials: true,
  origin(origin, cb) {
    if (!origin || whiteList.includes(origin)) {
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
  // console.log(user);

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

app.post("/api/users/logout", checkToken, (req, res) => {
  const { account } = req.decoded;
  const user = users.find((u) => u.account == account);
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "登出失敗",
    });
  }
  const token = jwt.sign(
    {
      message: "過期的token",
    },
    secretKey,
    { expiresIn: "-10s" }
  );
  res.status(200).json({
    status: "success",
    message: "登出成功",
    data: token,
  });
});

app.post("/api/users/status", checkToken, (req, res) => {
  const { account } = req.decoded;
  const user = users.find((u) => u.account == account);
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "請登入",
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
    message: "處於登入狀態",
    data: token,
  });
});

app.listen(3000, () => {
  console.log("主機已啟動於 http://localhost:3000");
});

function checkToken(req, res, next) {
  let token = req.get("Authorization");
  console.log(token);
  if (token && token.includes("Bearer ")) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log(error);
        res.status(401).json({
          status: "error",
          message: "登入驗證失效，請重新登入",
        });
        return;
      }
      req.decoded = decoded;
      next();
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
    });
  }
}
