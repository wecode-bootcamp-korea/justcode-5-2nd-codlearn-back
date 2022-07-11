CREATE TABLE category (
	id int not null auto_increment,
	name varchar(500) not null,
	depth int,
	parent_id int,
	PRIMARY KEY (id)
)