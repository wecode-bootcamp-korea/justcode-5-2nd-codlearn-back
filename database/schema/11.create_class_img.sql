CREATE TABLE class_img (
	id int not null auto_increment,
	url varchar(1000) not null,
	class_id int not null,
	primary key (id),
	FOREIGN key (class_id) references classes(id)
)