CREATE TABLE my_classes (
	id int not null auto_increment,
	user_id int not null,
	class_id int not null,
	progress int not null DEFAULT 1, 
	primary key (id),
	FOREIGN key (user_id) references users(id),
	FOREIGN key (class_id) references classes(id)
)