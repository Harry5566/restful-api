-- 這個檔案就像是建造學校的藍圖！
-- 它告訴電腦要如何建立資料庫和資料表

-- 建立一個叫做 'restful' 的資料庫（就像建立一個新的學校）
create DATABASE restful;

-- 刪除 'restful' 資料庫（就像拆掉舊學校）
-- 注意：這行很危險！會把整個資料庫刪掉
drop DATABASE restful;

-- 選擇使用 'restful' 資料庫（就像走進這個學校）
use restful;

-- 建立使用者資料表（就像製作學生名冊的格式）
create Table users(
  id int AUTO_INCREMENT PRIMARY KEY,  -- 自動編號，就像學生的學號，每個人都不一樣
  account VARCHAR(50),               -- 使用者帳號，最多50個字元
  password VARCHAR(100),             -- 使用者密碼，最多100個字元（通常會加密所以比較長）
  mail VARCHAR(100),                 -- 電子信箱，最多100個字元
  head VARCHAR(100)                  -- 頭像圖片網址，最多100個字元
);

-- 在使用者資料表中新增第一個測試使用者（就像第一個學生報到）
INSERT INTO users(account, password, mail, head) 
value ('ben', 'a12345', 'ben@ben.com', 'https://randomuser.me/api/portraits/men/20.jpg');

-- 在使用者資料表中新增第二個測試使用者（就像第二個學生報到）
INSERT INTO users(account, password, mail, head) 
value ('mary', 'a12345', 'mary@ben.com', 'https://randomuser.me/api/portraits/women/84.jpg');