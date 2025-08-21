// 這個檔案就像是使用者服務中心！
// 它負責處理所有跟使用者有關的事情：註冊、登入、登出、查找等等

// 引入各種工具包，就像作料理前要準備各種工具
import express from "express"; // Express框架，建立網站的主要工具
import multer from "multer"; // 處理上傳檔案的工具
import bcrypt from "bcrypt"; // 密碼加密工具，保護密碼安全
import jwt from "jsonwebtoken"; // 發放登入証明的工具，像通行證
import mysql from "mysql2/promise"; // 連接MySQL資料庫的工具
import connection from "../connect.js"; // 引入我們設定好的資料庫連線

// 設定上傳檔案處理器
const upload = multer();

// 從環境變數取得祕密金鑰，用來製作登入証明的祕密配方
const secretKey = process.env.JWT_SECRET_KEY;

// 建立使用者路由器：就像設立一個專門處理使用者事務的櫃檯
const router = express.Router();

// ===== 使用者相關的各種服務功能 =====
// route(s) 路由規則(們)
// routes routers (路由物件器)

// 📋 功能1：獲取所有使用者清單
// 就像問老師：「班上有哪些同學？」
router.get("/", async (req, res) => {
  try {
    // 嘗嘗看能不能成功
    // 從資料庫中取得所有使用者的資料
    const sql = "SELECT * FROM `users`;";
    let [users] = await connection.execute(sql); // 執行SQL指令並等待結果

    // 成功的話，把結果傳回給客人
    res.status(200).json({
      // 200代表「成功」
      status: "success", // 告訴客人：「成功了！」
      data: users, // 把所有使用者資料給客人看
      message: "已獲取所有使用者", // 給客人看的說明
    });
  } catch (error) {
    // 如果出錯的話
    // 捕獲錯誤：就像捕蛳蛉一樣，把錯誤抓住處理
    console.log(error); // 在控制台印出錯誤訊息，方便程式員除錯

    // 設定預設值，如果沒有特定錯誤碼就用預設的
    const statusCode = error.code ?? 401; // ??意思是「如果為空就用401」
    const statusText = error.status ?? "error";
    const message = error.message ?? "身分驗證錯誤，請洽管理人員";

    // 告訴客人出錯了
    res.status(statusCode).json({
      status: statusText,
      message, // message: message 的簡寫
    });
  }
});

// 🔍 功能2：搜尋使用者
// 就像在班級名冊中找特定的同學
router.get("/search", (req, res) => {
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  // 例如：/api/users/search?key=小明
  const key = req.query.key; // 取得使用者想搜尋的關鍵字

  res.status(200).json({
    status: "success", // 告訴客人：「搜尋成功！」
    data: { key }, // 把搜尋的關鍵字回傳給客人看
    message: "搜尋使用者 成功", // 給客人看的說明
  });
});

// 👤 功能3：獲取特定使用者的詳細資訊
// 就像在通訊錄中查找特定人的資料
router.get("/:id", async (req, res) => {
  try {
    // 嘗嘗看能不能成功
    // 路由參數：從網址中取得使用者的帳號
    // 例如：/api/users/john 中的 john 就是 id
    const account = req.params.id;

    // 檢查是否有提供帳號
    if (!account) {
      const err = new Error("請提供使用者 ID"); // 建立一個錯誤訊息
      err.code = 400; // 設定錯誤代碼：400代表「客戶訊息有問題」
      err.status = "fail"; // 設定狀態
      throw err; // 丟出錯誤，跳到catch區塊
    }

    // 從資料庫中搜尋這個帳號的使用者
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account]) // 執行SQL指令，?會被更換成account的值
      .then(([result]) => {
        // 等執行完成後
        return result[0]; // 取第一筆結果（帳號是唯一的）
      });

    // 檢查是否找到這個使用者
    if (!user) {
      const err = new Error("找不到使用者"); // 建立錯誤訊息
      err.code = 404; // 404代表「找不到資料」
      err.status = "fail";
      throw err;
    }

    // 從使用者資料中移除敏感資訊（id和密碼）
    // 就像是把身分證上的敏感資訊遮起來
    const { id, password, ...data } = user;

    // 成功回傳使用者資料（但不包含id和密碼）
    res.status(200).json({
      status: "success", // 告訴客人：「找到了！」
      data: data, // 使用者的安全資料（不包含密碼）
      message: "查詢成功", // 給客人看的說明
    });
  } catch (error) {
    // 如果出錯的話
    // 捕獲錯誤處理：跟上面一樣的錯誤處理機制
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身分驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message, // message: message
    });
  }
});

// ➕ 功能4：新增一個使用者（註冊功能）
// 就像在學校辦理入學手續
router.post("/", upload.none(), async (req, res) => {
  try {
    // 嘗嘗看能不能成功註冊
    // 從表單中取得使用者填寫的資料
    // 就像從報名表上看學生填寫的姓名、密碼、電子信箱
    const { account, password, mail } = req.body;
    // console.log({ account, password, mail });  // 這行被註解掉了，原本是用來除錯的

    // 檢查必填欄位：就像老師檢查學生是否把表單填完整
    if (!account || !password || !mail) {
      // 如果有任何一個欄位沒填，就建立一個錯誤訊息
      const err = new Error("請提供完整的使用者資訊"); // 就像老師說：「表單沒填完整！」
      err.code = 400; // 設定錯誤代碼：400代表「客戶資訊有問題」
      err.status = "fail"; // 設定狀態：「失敗」
      throw err; // 丟出錯誤，跳到catch區塊處理

      // 下面這段被註解掉的代碼是舊的錯誤處理方式
      // return res.status(400).json({
      //   status: "fail",
      //   message: "請提供完整的使用者資訊",
      // });
    }

    // 檢查帳號有沒有被使用過：就像檢查學號是否已經存在
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account]) // 執行SQL查詢，?會被更換成account的值
      .then(([result]) => {
        // 等查詢結果回來
        return result[0]; // 取第一筆結果（如果有的話）
      });

    // 如果找到了，表示這個帳號已經被使用了
    if (user) {
      const err = new Error("提供的註冊內容已被使用1"); // 就像說：「這個帳號已經有人用了！」
      err.code = 400;
      err.status = "fail";
      throw err; // 丟出錯誤，不讓註冊繼續
    }

    // 檢查電子信箱有沒有被使用過：就像檢查信箱是否已經註冊過
    const sqlCheck2 = "SELECT * FROM `users` WHERE `mail` = ?;";
    user = await connection.execute(sqlCheck2, [mail]).then(([result]) => {
      return result[0]; // 取第一筆結果（如果有的話）
    });

    // 如果找到了，表示這個電子信箱已經被使用了
    if (user) {
      const err = new Error("提供的註冊內容已被使用2"); // 就像說：「這個信箱已經有人用了！」
      err.code = 400;
      err.status = "fail";
      throw err; // 丟出錯誤，不讓註冊繼續
    }

    // 從 randomuser.me 網站取得一個隨機的使用者頭像圖片
    // 就像是幫新同學拍一張學生證照片
    const head = await getRandomAvatar();

    // 把密碼加密：就像是把密碼放進保險箱，防止被偷看
    // bcrypt.hash 會把簡單的密碼變成複雜的密碼，10是加密強度
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立 SQL 指令：就像寫一張「請幫我新增一筆資料」的便條
    const sql =
      "INSERT INTO `users` (account, password, mail, head) VALUES (?, ?, ?, ?);";
    // 執行 SQL 指令，把新使用者的資料存入資料庫
    await connection.execute(sql, [account, hashedPassword, mail, head]);

    // 註冊成功！告訴客人好消息
    res.status(201).json({
      // 201代表「已建立新資料」
      status: "success", // 告訴客人：「註冊成功！」
      data: {}, // 空資料（不回傳敏感資訊）
      message: "新增一個使用者 成功", // 給客人看的歡迎訊息
    });
  } catch (error) {
    // 如果註冊過程中出錯的話
    // 捕獲錯誤處理：就像是處理報名出錯的情況
    console.log(error); // 在控制台印出錯誤訊息，幫助程式員除錯

    // 設定預設值，防止系統崩潰
    const statusCode = error.code ?? 500; // 如果沒有错誤碼就用500（伺服器內部錯誤）
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";

    // 告訴客人註冊失敗了
    res.status(statusCode).json({
      status: statusText,
      message, // message: message 的簡寫
    });
  }
});

// ✏️ 功能5：更新特定使用者的資訊
// 就像是修改學生資料，比如更換電話或地址
router.put("/:id", (req, res) => {
  // 從網址中取得要更新的使用者ID
  const id = req.params.id;

  // 目前只是回傳成功訊息，還沒有實際更新功能
  res.status(200).json({
    status: "success", // 告訴客人：「更新成功！」
    data: { id }, // 回傳被更新的使用者ID
    message: `已成功更新 ${id} 使用者`, // 告訴客人更新了哪個使用者
  });
});

// 🗑️ 功能6：刪除特定使用者
// 就像是從班級名冊中刪除轉學的學生
router.delete("/:id", (req, res) => {
  // 從網址中取得要刪除的使用者ID
  const id = req.params.id;

  // 目前只是回傳成功訊息，還沒有實際刪除功能
  res.status(200).json({
    status: "success", // 告訴客人：「刪除成功！」
    data: { id }, // 回傳被刪除的使用者ID
    message: `已成功刪除 ${id} 使用者`, // 告訴客人刪除了哪個使用者
  });
});

// 🔐 功能7：使用者登入
// 就像是在學校門口檢查學生證，確認身分後才能進入
router.post("/login", upload.none(), async (req, res) => {
  try {
    // 嘗嘗看能不能成功登入
    // 從表單中取得使用者填寫的帳號和密碼
    const { account, password } = req.body;
    console.log(account); // 在控制台顯示是哪個帳號在嘗試登入

    // 從資料庫中查找這個帳號的使用者資料
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?";
    let user = await connection
      .execute(sqlCheck1, [account]) // 執行SQL查詢
      .then(([result]) => {
        return result[0]; // 取第一筆結果
      });

    // console.log(user);  // 這行被註解掉了，原本是用來除錯的

    // 檢查：如果資料庫中沒有這個帳號
    if (!user) {
      const err = new Error("帳號或密碼錯誤1"); // 為了安全，不說明究竟是帳號還是密碼錯誤
      err.code = 400;
      err.status = "error";
      throw err; // 丟出錯誤，停止登入程序

      // 下面這段被註解掉的代碼是舊的錯誤處理方式
      // return res.status(400).json({
      //   status: "error",
      //   message: "帳號或密碼錯誤",
      // });
    }

    // 檢查密碼是否正確：用bcrypt比對使用者輸入的密碼和資料庫中的加密密碼
    // 就像是檢查鑰匙是否能打開鎖
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2"); // 密碼不對，但為了安全不明說
      err.code = 400;
      err.status = "error";
      throw err; // 丟出錯誤，登入失敗
    }

    console.log(user);

    // 密碼正確！製作一個登入証明（JWT Token）
    // 就像是發給學生一張「今日已登入」的通行證
    const token = jwt.sign(
      {
        // 在証明上記錄使用者的基本資料
        account: user.account, // 使用者帳號
        mail: user.mail, // 使用者信箱
        head: user.head, // 使用者頭像
      },
      secretKey, // 用祕密金鑰加密証明，防止被假造
      { expiresIn: "30m" } // 証明30分鐘後就會過期，需要重新登入
    );

    const newUser = {
      // 在証明上記錄使用者的基本資料
      account: user.account, // 使用者帳號
      mail: user.mail, // 使用者信箱
      head: user.head, // 使用者頭像
    };

    // 登入成功！把証明給使用者
    res.status(200).json({
      status: "success", // 告訴使用者：「登入成功！」
      message: "登入成功", // 歡迎訊息
      data: { token, user: newUser }, // 把登入証明給使用者保存
    });
  } catch (error) {
    // 如果登入過程中出錯的話
    // 捕獲錯誤處理：跟註冊功能一樣的錯誤處理機制
    console.log(error); // 在控制台印出錯誤訊息

    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登入失敗，請洽管理人員";

    // 告訴使用者登入失敗了
    res.status(statusCode).json({
      status: statusText,
      message, // message: message 的簡寫
    });
  }
});

// 🚪 功能8：使用者登出
// 就像是在學校門口交回通行證，說「我要回家了」
router.post("/logout", checkToken, async (req, res) => {
  try {
    // 嘗嘗看能不能成功登出
    // 從登入証明中取得使用者的帳號
    const { account } = req.decoded;

    // 確認這個帳號真的存在於資料庫中
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });

    // 如果找不到這個使用者，表示有問題
    if (!user) {
      const err = new Error("登出失敗"); // 可能是帳號已被刪除或者証明有問題
      err.code = 401; // 401代表「無權限」
      err.status = "error";
      throw err;
    }

    // 製作一個已過期的証明，讓舊的登入証明失效
    // 就像是把通行證撰成「已失效」
    const token = jwt.sign(
      {
        message: "過期的token", // 標記為已過期的証明
      },
      secretKey,
      { expiresIn: "-10s" } // 設定-10秒，表示10秒前就過期了
    );

    // 登出成功！
    res.status(200).json({
      status: "success", // 告訴使用者：「登出成功！」
      message: "登出成功", // 道別訊息
      data: token, // 給一個已過期的証明，讓舊証明失效
    });
  } catch (error) {
    // 如果登出過程中出錯的話
    // 捕獲錯誤處理
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登出失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message, // message: message
    });
  }
});

// 📊 功能9：檢查登入狀態
// 就像是問「我還有沒有權限進入學校？」
router.post("/status", checkToken, async (req, res) => {
  try {
    // 嘗嘗看能不能成功確認狀態
    // 從登入証明中取得使用者的帳號
    const { account } = req.decoded;

    // 確認這個帳號仍然存在於資料庫中（沒有被刪除）
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });

    // 如果找不到這個使用者，表示帳號已被刪除或有問題
    if (!user) {
      const err = new Error("請登入"); // 要求重新登入
      err.code = 401; // 401代表「無權限」
      err.status = "error";
      throw err;
    }

    // 狀態正常！產生一個新的登入証明（就像續籤通行證）
    const token = jwt.sign(
      {
        // 用最新的使用者資料製作証明
        account: user.account,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      { expiresIn: "30m" } // 新証明又可以用30分鐘
    );

    // 告訴使用者：「你還在登入狀態！」
    res.status(200).json({
      status: "success", // 狀態正常
      message: "處於登入狀態", // 確認訊息
      data: token, // 給新的登入証明
    });
  } catch (error) {
    // 捕獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身分驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message, // message: message
    });
  }
});

// 🔍 輔助函數：檢查登入証明
// 這個函數就像學校的門當，檢查每個人的通行證是否有效
function checkToken(req, res, next) {
  // 從請求標頭中取得登入証明
  // 就像是看來訪者有沒有帶身分證
  let token = req.get("Authorization");
  console.log(token); // 在控制台顯示收到的証明，方便除錯

  // 檢查是否有証明，且是否以"Bearer "開頭（標準格式）
  if (token && token.includes("Bearer ")) {
    // 移除"Bearer "的部分，只保留真正的証明內容
    // slice(7)意思是從第7個字元開始截取（"Bearer "有等7個字元）
    token = token.slice(7);

    // 驗證証明是否有效：就像是檢查身分證的真假
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        // 如果証明有問題（過期、被粄改、格式錯誤等）
        console.log(error); // 印出錯誤訊息
        res.status(401).json({
          // 401代表「無權限」
          status: "error",
          message: "登入驗證失效，請重新登入", // 要求重新登入
        });
        return; // 結束函數，不讓使用者進入
      }
      // 証明有效！把証明中的使用者資訊存到req中，供後續使用
      req.decoded = decoded;
      next(); // 通行！讓使用者繼續使用其他功能
    });
  } else {
    // 如果沒有証明或格式不對
    res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入", // 要求先去登入
    });
  }
}

// 🖼️ 輔助函數：取得隨機頭像
// 這個函數就像是去照相館幫新學生拍學生證照片
async function getRandomAvatar() {
  // 設定要去的API網址，這是一個免費提供隨機使用者資料的網站
  const API = "https://randomuser.me/api";

  try {
    // 嘗嘗看能不能成功取得照片
    // 向網站發出請求，就像是打電話問：「能給我一張隨機照片嗎？」
    const response = await fetch(API);

    // 檢查是否成功取得回應
    if (!response.ok)
      throw new Error(`${response.status}: ${response.statusText}`);

    // 把回應轉換成JSON格式，就像是把網站的回應轉成我們看得懂的格式
    const result = await response.json();

    // 從網站的回應中取得大尺寸的頭像照片網址
    // https://randomuser.me/api 的 API JSON檔中，results[0].picture.large 就是大頭像的網址
    return result.results[0].picture.large;
  } catch (error) {
    // 如果取得頭像失敗的話
    // 在控制台印出錯誤訊息，但不讓程式崩潰
    console.log("getRandomAvatar", error.message);
    return null; // 回傳null，表示沒有取得頭像
  }
}

// 把這個使用者服務中心的路由器匯出，讓主程式可以使用
// 就像是把整個使用者服務部門搬到大廳給大家使用
export default router;
