create table token (
id int not null auto_increment,
codlearn_token varchar(500) unique not null,
kakao_token varchar(500) unique not null, 
created_at DATETIME DEFAULT NOW(),
primary key (id));