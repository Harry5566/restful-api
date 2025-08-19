// 這個檔案就像是連接到銀行保險箱的鑰匙！
// 它負責讓我們的程式可以和資料庫說話，存取裡面的資料

// 引入MySQL資料庫的工具包，就像拿到開保險箱的專用鑰匙
import mysql from "mysql2/promise";

// 建立資料庫連線池：就像銀行有很多個櫃檯，可以同時服務多個客人
// 連線池可以讓多個使用者同時使用資料庫，不用排隊等待
const connection = mysql.createPool({
  host: "localhost",        // 資料庫的地址，localhost表示在同一台電腦上
  port: 3306,              // 資料庫的門牌號碼，MySQL預設是3306
  user: "root",            // 登入資料庫的使用者名稱，就像你的帳號
  password: "",            // 登入資料庫的密碼，這裡是空的（正式環境不建議這樣）
  database: "restful",     // 要使用的資料庫名稱，就像要開哪一個保險箱
});

// 把這個連線設定匯出，讓其他檔案可以使用
// 就像把鑰匙借給其他人，讓他們也能開保險箱
export default connection;
