CREATE TABLE review (
	id int not null auto_increment,
	user_id int not null,
	parent_id int, 
	rate float not null,
	class_id int not null,
	review_content text, 
	primary key (id),
	FOREIGN key (user_id) references users(id),
	FOREIGN key (class_id) references classes(id),
	FOREIGN key (parent_id) references review(id)
)