// 測試.env是否有抓取到
// console.log(process.env.JWT_SECRET_KEY);

// 這個檔案就像是整個網站的大門管理員！
// 它負責接待所有來訪的客人（使用者），並決定他們可以去哪裡

// 引入各種工具包，就像準備做菜前要準備各種廚具一樣
import express, { json } from "express";  // Express是建立網站伺服器的主要工具，就像蓋房子的地基
import multer from "multer";              // Multer是處理上傳檔案的工具，像郵差幫你收包裹
import cors from "cors";                  // CORS是管理誰可以訪問網站的警衛，防止壞人進來
import moment from "moment";              // Moment是處理時間日期的工具，像日曆和時鐘
import { v4 as uuidv4 } from "uuid";     // UUID是產生獨特ID的工具，像每個人的身分證號碼都不一樣
import usersRouter from "./routes/users.js";     // 引入處理使用者相關功能的路由檔案
import productsRouter from "./routes/products.js"; // 引入處理產品相關功能的路由檔案

// ===== 設定區域：就像設定遊樂園的規則一樣 =====

// 設定上傳檔案的處理器，但現在還是空的設定（就像準備了一個空箱子）
const upload = multer();

// 白名單：只有這些網址可以來訪問我們的網站，就像只讓認識的朋友進你家
let whitelist = ["http://localhost:5500", "http://localhost:3000"];

// CORS設定：決定誰可以跟我們的網站說話的規則
let corsOptions = {
  credentials: true,  // 允許傳送登入資訊，就像允許朋友帶身分證進來
  origin(origin, callback) {  // 檢查來訪者是不是我們認識的朋友
    if (!origin || whitelist.includes(origin)) {  // 如果沒有來源或是在白名單內
      callback(null, true);  // 告訴系統：「可以進來！」
    } else {
      callback(new Error("Not allowed by CORS"));  // 告訴系統：「不可以進來！」
    }
  },
};

// ===== 路由區域：就像設定各個房間的功能一樣 =====

// 建立我們的網站應用程式，就像蓋了一棟房子
const app = express();

// 套用CORS規則，就像在門口放一個警衛檢查訪客
app.use(cors(corsOptions));

// 讓我們的網站能夠理解JSON格式的資料，就像學會看懂英文信件
app.use(express.json());

// 讓我們的網站能夠理解表單資料，就像學會看懂中文信件
app.use(express.urlencoded({ extended: true }));

// 設定首頁：當有人直接訪問我們網站時看到的歡迎頁面
app.get("/", (req, res) => {
  res.send("首頁");  // 就像門口的歡迎標語
});

// 設定路由分配：就像指路標，告訴訪客要去哪個房間辦事
// 只要請求的網址以 /api/users 開頭，就會交給 usersRouter 處理
// 在 usersRouter 裡面寫的路由，不需要再重複寫 /api/users
// 就像郵差知道「台北市」開頭的信件要送到台北一樣
app.use("/api/users", usersRouter);     // 處理使用者相關的事務（註冊、登入等）
app.use("/api/pds", productsRouter);    // 處理產品相關的事務（查看、新增產品等）

// 啟動伺服器：就像開店營業，告訴大家「我們開門了！」
app.listen(3005, () => {
  console.log("主機啟動 http://localhost:3005");  // 在控制台顯示店面地址
});
