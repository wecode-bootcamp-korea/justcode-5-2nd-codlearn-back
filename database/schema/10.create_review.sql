CREATE TABLE review (
	id int not null auto_increment,
	user_id int not null,
	rate float not null,
	class_id int not null,
	primary key (id),
	FOREIGN key (user_id) references users(id),
	FOREIGN key (class_id) references classes(id)
)