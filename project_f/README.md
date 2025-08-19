# RESTful API 專案 📚

一個使用 Node.js + Express + MySQL 建立的 RESTful API 專案，專為學習者設計，包含詳細的中文註解！

## 🌟 專案特色

- **教學友善**: 每行程式碼都有詳細的中文註解，連12歲小朋友都能看懂！
- **完整功能**: 包含使用者註冊、登入、CRUD操作等完整功能
- **安全機制**: 使用 bcrypt 加密密碼，JWT 處理身分驗證
- **現代技術**: 使用 ES6+ 語法，async/await 處理異步操作

## 🛠️ 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Node.js | - | 後端運行環境 |
| Express | ^5.1.0 | 網站框架 |
| MySQL | - | 資料庫 |
| bcrypt | ^6.0.0 | 密碼加密 |
| jsonwebtoken | ^9.0.2 | JWT 身分驗證 |
| cors | ^2.8.5 | 跨域請求處理 |
| multer | ^2.0.2 | 檔案上傳處理 |
| nodemon | ^3.1.10 | 開發時自動重啟 |

## 📋 功能清單

### 👤 使用者管理
- ✅ 使用者註冊（含密碼加密）
- ✅ 使用者登入（JWT 驗證）
- ✅ 使用者登出
- ✅ 檢查登入狀態
- ✅ 獲取所有使用者
- ✅ 獲取特定使用者
- ✅ 搜尋使用者
- ✅ 更新使用者資料
- ✅ 刪除使用者

### 📦 產品管理
- ✅ 獲取所有產品
- ✅ 獲取特定產品
- ✅ 搜尋產品
- ✅ 新增產品
- ✅ 更新產品
- ✅ 刪除產品

## 🚀 快速開始

### 1. 環境要求
- Node.js (建議 v16 以上)
- MySQL (建議 v8.0 以上)
- npm 或 yarn

### 2. 安裝專案
```bash
# 複製專案
git clone [你的專案網址]
cd restful-api/project_f

# 安裝依賴
cd server
npm install
```

### 3. 設定資料庫
```bash
# 1. 啟動 MySQL 服務
# 2. 執行 server.sql 檔案建立資料庫和資料表
mysql -u root -p < server.sql
```

### 4. 設定環境變數
建立 `server/lu.env` 檔案：
```env
JWT_SECRET_KEY=your_super_secret_key_here
```

### 5. 啟動專案
```bash
# 開發模式（自動重啟）
npm run dev

# 或直接執行
node index.js
```

伺服器將在 `http://localhost:3005` 啟動 🎉

## 📖 API 文件

### 基礎路徑
- 使用者相關: `http://localhost:3005/api/users`
- 產品相關: `http://localhost:3005/api/pds`

### 🔐 使用者 API

| 方法 | 路徑 | 功能 | 需要驗證 |
|------|------|------|----------|
| GET | `/api/users` | 獲取所有使用者 | ❌ |
| GET | `/api/users/:id` | 獲取特定使用者 | ❌ |
| GET | `/api/users/search?key=關鍵字` | 搜尋使用者 | ❌ |
| POST | `/api/users` | 註冊新使用者 | ❌ |
| POST | `/api/users/login` | 使用者登入 | ❌ |
| POST | `/api/users/logout` | 使用者登出 | ✅ |
| POST | `/api/users/status` | 檢查登入狀態 | ✅ |
| PUT | `/api/users/:id` | 更新使用者 | ❌ |
| DELETE | `/api/users/:id` | 刪除使用者 | ❌ |

### 📦 產品 API

| 方法 | 路徑 | 功能 | 需要驗證 |
|------|------|------|----------|
| GET | `/api/pds` | 獲取所有產品 | ❌ |
| GET | `/api/pds/:id` | 獲取特定產品 | ❌ |
| GET | `/api/pds/search?key=關鍵字` | 搜尋產品 | ❌ |
| POST | `/api/pds` | 新增產品 | ❌ |
| PUT | `/api/pds/:id` | 更新產品 | ❌ |
| DELETE | `/api/pds/:id` | 刪除產品 | ❌ |

## 📝 使用範例

### 註冊新使用者
```javascript
fetch('http://localhost:3005/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'account=testuser&password=123456&mail=test@example.com'
})
.then(response => response.json())
.then(data => console.log(data));
```

### 使用者登入
```javascript
fetch('http://localhost:3005/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'account=testuser&password=123456'
})
.then(response => response.json())
.then(data => {
  const token = data.data; // 保存這個 token
  localStorage.setItem('token', token);
});
```

### 需要驗證的請求
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3005/api/users/status', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🗄️ 資料庫結構

### users 資料表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INT (主鍵) | 自動遞增的使用者ID |
| account | VARCHAR(50) | 使用者帳號 |
| password | VARCHAR(100) | 加密後的密碼 |
| mail | VARCHAR(100) | 電子信箱 |
| head | VARCHAR(100) | 頭像圖片網址 |

## 🔒 安全機制

1. **密碼加密**: 使用 bcrypt 進行密碼雜湊，安全強度 10
2. **JWT 驗證**: 登入後核發 JWT token，有效期 30 分鐘
3. **CORS 控制**: 限制只允許特定域名訪問 API
4. **錯誤處理**: 完整的錯誤捕獲和處理機制

## 📁 專案結構

```
project_f/
├── server/                 # 伺服器主要程式
│   ├── routes/            # 路由檔案
│   │   ├── users.js       # 使用者相關 API
│   │   ├── products.js    # 產品相關 API
│   │   └── test.sql       # SQL 測試語句
│   ├── index.js           # 主程式入口
│   ├── connect.js         # 資料庫連線設定
│   ├── user.js            # 測試用使用者資料
│   ├── package.json       # 專案設定檔
│   └── lu.env             # 環境變數
├── server.sql             # 資料庫建立腳本
└── README.md             # 專案說明文件
```

## 🎯 學習重點

這個專案非常適合學習：
- RESTful API 設計原則
- Express.js 框架使用
- MySQL 資料庫操作
- JWT 身分驗證機制
- 密碼安全處理
- 非同步程式設計
- 錯誤處理最佳實務
- CORS 跨域請求處理

## 🤝 貢獻指南

歡迎提交 Issues 和 Pull Requests！

1. Fork 這個專案
2. 建立你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

---