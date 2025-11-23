CREATE DATABASE galeria
USE galeria

CREATE TABLE users(
	user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	email VARCHAR(60) NOT NULL,
	username VARCHAR(60) NOT NULL,
	password VARCHAR(100) NOT NULL
)

CREATE TABLE posts(
	post_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	user_id INT,
	likes INT,
	comment_id INT,
    imagePath VARCHAR(100),
	description VARCHAR(255)
)

CREATE TABLE comment(
	comment_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	commentText VARCHAR(255) NOT NULL,
    user_id INT,
    post_id INT
)



