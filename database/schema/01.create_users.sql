CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(50),
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(300) NOT NULL,
	user_img VARCHAR(3000) DEFAULT "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtdz6QQYO7SjHPl-ruRNK-KbfAKhjQEeOAmg&usqp=CAU",
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME,
  PRIMARY KEY (id)
);