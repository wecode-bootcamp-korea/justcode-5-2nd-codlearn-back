CREATE TABLE contents (
	id int not null auto_increment,
	class_id int not null,
	content text,
	primary key(id),
	FOREIGN key (class_id) references classes(id)
)