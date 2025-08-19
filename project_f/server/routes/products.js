// 這個檔案就像是產品部門的服務櫃檯！
// 它負責處理所有跟產品有關的事情，比如查看產品、新增產品等

// 引入需要的工具包
import express from "express";  // Express框架，用來建立網路服務
import multer from "multer";    // Multer工具，用來處理上傳的檔案

// 設定檔案上傳處理器（目前是空設定）
const upload = multer();

// 建立路由器：就像設立一個專門處理產品事務的櫃檯
const router = express.Router();

// ===== 產品相關的各種服務功能 =====
// route(s) 路由規則(們)
// routes routers (路由物件器)

// 📋 功能1：獲取所有產品清單
// 就像走進商店問：「你們有什麼產品？」
router.get("/", (req, res) => {
  // 回傳成功訊息和空的產品清單（目前還沒有真的產品資料）
  res.status(200).json({        // 200代表「成功」
    status: "success",          // 告訴客人：「成功了！」
    data: [],                   // 產品清單（現在是空的）
    message: "已獲取所有產品",    // 給客人看的訊息
  });
});

// 🔍 功能2：搜尋產品
// 就像問店員：「你們有賣蘋果嗎？」
router.get("/search", (req, res) => {
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  // 例如：/api/pds/search?key=蘋果
  const { key } = req.query;  // 取得使用者想搜尋的關鍵字
  
  res.status(200).json({
    status: "success",          // 告訴客人：「搜尋成功！」
    data: { key },             // 把搜尋的關鍵字回傳給客人看
    message: "搜尋產品 成功",   // 給客人看的訊息
  });
});

// 👀 功能3：獲取特定產品的詳細資訊
// 就像指著某個商品問：「這個多少錢？」
router.get("/:id", (req, res) => {
  // 路由參數：從網址中取得產品ID
  // 例如：/api/pds/123 中的 123 就是 id
  const id = req.params.id;
  
  res.status(200).json({
    status: "success",           // 告訴客人：「找到了！」
    data: { id },               // 把產品ID回傳（{id: id}的省略寫法）
    message: `已獲取 ${id} 產品`, // 告訴客人找到了哪個產品
  });
});

// ➕ 功能4：新增一個產品
// 就像店長說：「我們要賣新商品了！」
router.post("/", (req, res) => {
  // 這裡應該要處理產品資料，但目前只是回傳成功訊息
  res.status(201).json({        // 201代表「已建立新資料」
    status: "success",          // 告訴客人：「新增成功！」
    data: {},                   // 新產品的資料（目前是空的）
    message: "新增一個產品 成功", // 給客人看的訊息
  });
});

// ✏️ 功能5：更新特定產品的資訊
// 就像店長說：「這個商品要改價格了！」
router.put("/:id", (req, res) => {
  // 從網址取得要更新的產品ID
  const id = req.params.id;
  
  res.status(200).json({
    status: "success",              // 告訴客人：「更新成功！」
    data: { id },                  // 回傳更新的產品ID
    message: `已成功更新 ${id} 產品`, // 告訴客人更新了哪個產品
  });
});

// 🗑️ 功能6：刪除特定產品
// 就像店長說：「這個商品不賣了！」
router.delete("/:id", (req, res) => {
  // 從網址取得要刪除的產品ID
  const id = req.params.id;
  
  res.status(200).json({
    status: "success",              // 告訴客人：「刪除成功！」
    data: { id },                  // 回傳被刪除的產品ID
    message: `已成功刪除 ${id} 產品`, // 告訴客人刪除了哪個產品
  });
});

// 🔐 功能7：產品登入（這個功能有點奇怪，產品通常不需要登入）
// 可能是測試用的功能，或是管理產品的特殊權限
router.post("/login", upload.none(), (req, res) => {
  // 取得帳號和密碼
  const { account, password } = req.body;
  
  res.status(200).json({
    status: "success",      // 告訴客人：「登入成功！」
    data: "token",         // 回傳一個假的登入憑證
    message: "產品登入 成功", // 給客人看的訊息
  });
});

// 🚪 功能8：產品登出
// 跟登入一樣，這個功能也比較特殊
router.post("/logout", checkToken, (req, res) => {
  res.status(200).json({
    status: "success",      // 告訴客人：「登出成功！」
    data: "token",         // 回傳一個假的登出憑證
    message: "產品登出 成功", // 給客人看的訊息
  });
});

// 📊 功能9：檢查登入狀態
// 確認使用者是否還在登入狀態
router.post("/status", checkToken, (req, res) => {
  res.status(200).json({
    status: "success", // 告訴客人：「狀態正常！」
    data: "token",    // 回傳狀態資訊
    message: "狀態成功", // 給客人看的訊息
  });
});

// 🔍 輔助函數：檢查登入憑證
// 這個函數現在什麼都沒做，只是讓程式繼續執行
// 在真實情況下，這裡應該要檢查使用者的登入憑證是否有效
function checkToken(req, res, next) {
  next();  // 直接讓程式繼續執行下一步
}

// 把這個路由器匯出，讓主程式可以使用
// 就像把這個產品部門的櫃檯搬到大廳給大家使用
export default router;
