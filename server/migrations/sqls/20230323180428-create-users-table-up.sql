/* Replace with your SQL commands */
CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email varchar(255),
    password varchar(255),
    time_created timestamp DEFAULT CURRENT_TIMESTAMP
);