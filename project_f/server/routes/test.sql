-- 這個檔案是用來測試資料庫操作的小抄！
-- 就像是練習寫功課的草稿紙

-- 新增使用者的SQL指令範例（?是佔位符號，會被真實資料替換）
-- 就像填空題：在使用者表格中插入（帳號、密碼、信箱、頭像）的值
INSERT INTO `users` (account, password, mail, head) VALUES (?, ?, ?, ?);

-- 查詢特定使用者的SQL指令範例
-- 就像在學生名冊中找名叫'lu'的同學
SELECT * FROM `users` WHERE `account` = 'lu';