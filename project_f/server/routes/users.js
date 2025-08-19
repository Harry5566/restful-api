import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const upload = multer();

const router = express.Router();

// route(s) 路由規則(們)
// routes routers (路由物件器)
// 獲取所有使用者
router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: [],
    message: "已獲取所有使用者",
  });
});

// 搜尋使用者
router.get("/search", (req, res) => {
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
    message: "搜尋使用者 成功",
  });
});

// 獲取特定 ID 的使用者
router.get("/:id", (req, res) => {
  // 路由參數
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id }, // {id: id}(不省略版),
    message: `已獲取 ${id} 使用者`,
  });
});

// 新增一個使用者
router.post("/", upload.none(), async (req, res) => {
  const { account, name, password, mail } = req.body;
  console.log({ account, name, password, mail });

  if (!account || !name || !password || !mail) {
    return res.status(400).json({
      status: "fail",
      message: "請提供完整的使用者資訊",
    });
  }

  const head = await getRandomAvatar();
  // pending 等待中 -> await
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  res.status(201).json({
    status: "success",
    data: {},
    message: "新增一個使用者 成功",
  });
});

// 更新(特定 ID)的使用者
router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: `已成功更新 ${id} 使用者`,
  });
});

// 刪除(特定 ID)使用者
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: `已成功刪除 ${id} 使用者`,
  });
});

// 使用者登入
router.post("/login", upload.none(), (req, res) => {
  const { account, password } = req.body;
  res.status(200).json({
    status: "success",
    data: "token",
    message: "使用者登入 成功",
  });
});

// 使用者登出
router.post("/logout", checkToken, (req, res) => {
  res.status(200).json({
    status: "success",
    data: "token",
    message: "使用者登出 成功",
  });
});

// 檢查登入狀態
router.post("/status", checkToken, (req, res) => {
  res.status(200).json({
    status: "success",
    data: "token",
    message: "狀態成功",
  });
});

function checkToken(req, res, next) {
  next();
}

async function getRandomAvatar() {
  const API = "https://randomuser.me/api";
  try {
    const response = await fetch(API);
    if (!response.ok)
      throw new Error(`${response.status}: ${response.statusText}`);
    const result = await response.json();
    // https://randomuser.me/api 的 API JSON檔
    return result.results[0].picture.large;
  } catch (error) {
    console.log("getRandomAvatar", error.message);
    return null;
  }
}

export default router;
