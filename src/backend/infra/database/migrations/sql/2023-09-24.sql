-- DROP DATABASE IF EXISTS languageBoost;
-- CREATE DATABASE IF NOT EXISTS languageBoost;
-- USE languageBoost;

DROP TABLE IF EXISTS user_words;
DROP TABLE IF EXISTS translation;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS accounts;



CREATE TABLE accounts (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL,
        last_login TIMESTAMP
);

CREATE TABLE roles (
    role_id serial PRIMARY KEY,
    role_name VARCHAR ( 50 ) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES accounts (user_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

CREATE TABLE user_profile (
    user_id INT NOT NULL,
    first_name VARCHAR ( 50 ) NOT NULL,
    last_name VARCHAR ( 50 ) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES accounts (user_id)
);

CREATE TABLE words (
    word_id serial PRIMARY KEY,
    word VARCHAR ( 50 ) UNIQUE NOT NULL,
    lang VARCHAR ( 4 ) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE translation (
    word_id INT NOT NULL,
    translation_id INT NOT NULL,
    PRIMARY KEY (word_id, translation_id),
    FOREIGN KEY (word_id) REFERENCES words (word_id),
    FOREIGN KEY (translation_id) REFERENCES words (word_id)
);

CREATE TABLE user_words (
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    errors INT NOT NULL,
    attempts INT NOT NULL,
    PRIMARY KEY (user_id, word_id),
    FOREIGN KEY (user_id) REFERENCES accounts (user_id),
    FOREIGN KEY (word_id) REFERENCES words (word_id)
);





