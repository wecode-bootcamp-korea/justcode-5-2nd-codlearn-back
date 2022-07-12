CREATE TABLE my_classes (
	id int not null auto_increment,
	user_id int not null,
	class_id int not null,
	progress int not null DEFAULT 0, 
	created_at DATETIME DEFAULT NOW(),
	primary key (id),
	FOREIGN key (user_id) references users(id),
	FOREIGN key (class_id) references classes(id)
)