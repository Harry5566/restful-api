create DATABASE restful;
drop DATABASE restful;

use restful;

create Table users(
  id int AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(50),
  password VARCHAR(100),
  mail VARCHAR(100),
  head VARCHAR(100)
);

INSERT INTO users(account, password, mail, head) value ('ben', 'a12345', 'ben@ben.com', 'https://randomuser.me/api/portraits/men/20.jpg');

INSERT INTO users(account, password, mail, head) value ('mary', 'a12345', 'mary@ben.com', 'https://randomuser.me/api/portraits/women/84.jpg');