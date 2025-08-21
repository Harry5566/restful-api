// 這個檔案就像是一本通訊錄！
// 裡面存放了一些測試用的使用者資料，就像學校的學生名冊

// 建立一個使用者清單，就像班級名冊一樣
const users = [
  {
    _id: 1,                                                    // 使用者的編號，就像學號
    account: "user1",                                          // 使用者的帳號，就像暱稱
    name: "Maxine Jones",                                      // 使用者的真實姓名
    password: "user1",                                         // 使用者的密碼（這裡是明文，正式環境要加密）
    mail: "maxine.jones@example.com",                         // 使用者的電子信箱
    head: "https://randomuser.me/api/portraits/women/43.jpg", // 使用者的頭像照片網址
  },
  {
    _id: 2,                                                   // 第二個使用者的編號
    account: "user2",                                         // 第二個使用者的帳號
    name: "Rene Frazier",                                     // 第二個使用者的真實姓名
    password: "user2",                                        // 第二個使用者的密碼
    mail: "rene.frazier@example.com",                        // 第二個使用者的電子信箱
    head: "https://randomuser.me/api/portraits/men/64.jpg",  // 第二個使用者的頭像照片網址
  },
];

// 把使用者清單匯出，讓其他檔案可以使用
// 就像把通訊錄借給別人查看一樣
export default users;
