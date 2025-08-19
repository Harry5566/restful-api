import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import connection from "../connect.js";

const upload = multer();
const secretKey = process.env.JWT_SECRET_KEY;
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
  try {
    // 取得表單中的欄位內容
    const { account, password, mail } = req.body;
    // console.log({ account, password, mail });

    // 檢查必填
    if (!account || !password || !mail) {
      // 設定 Error 物件
      const err = new Error("請提供完整的使用者資訊"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼到 catch
      err.status = "fail"; // 利用物件的自訂屬性把 status 狀態碼到 catch
      throw err;
      // return res.status(400).json({
      //   status: "fail",
      //   message: "請提供完整的使用者資訊",
      // });
    }

    // 檢查 account 有沒有使用過
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (user) {
      const err = new Error("提供的註冊內容已被使用1");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    // 檢查 account 有沒有使用過
    const sqlCheck2 = "SELECT * FROM `users` WHERE `mail` = ?;";
    user = await connection.execute(sqlCheck2, [mail]).then(([result]) => {
      return result[0];
    });
    if (user) {
      const err = new Error("提供的註冊內容已被使用2");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    // 從 randomuser.me 取得一個使用者圖片
    const head = await getRandomAvatar();
    // pending 等待中 -> await
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立 SQL 語法
    const sql =
      "INSERT INTO `users` (account, password, mail, head) VALUES (?, ?, ?, ?);";
    await connection.execute(sql, [account, hashedPassword, mail, head]);

    res.status(201).json({
      status: "success",
      data: {},
      message: "新增一個使用者 成功",
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message, // message: message
    });
  }
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
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { account, password } = req.body;

    const user = await connection
      .execute("SELECT * FROM `users` WHERE `account` = ?", [account])
      .then(([result]) => {
        return result[0];
      });

    console.log(user);

    if (!user) {
      const err = new Error("帳號或密碼錯誤"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼到 catch
      err.status = "error"; // 利用物件的自訂屬性把 status 狀態碼到 catch
      throw err;
      // return res.status(400).json({
      //   status: "error",
      //   message: "帳號或密碼錯誤",
      // });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2");
      err.code = 400;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign(
      {
        account: user.account,
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
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登入失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message, // message: message
    });
  }
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
