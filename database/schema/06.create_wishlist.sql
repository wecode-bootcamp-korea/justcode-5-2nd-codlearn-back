CREATE TABLE wishlist (
	id int not null auto_increment,
	user_id int not null,
	class_id int not null,
	primary key (id),
	created_at DATETIME DEFAULT NOW(),
	FOREIGN key (user_id) references users(id),
	FOREIGN key (class_id) references classes(id)
)