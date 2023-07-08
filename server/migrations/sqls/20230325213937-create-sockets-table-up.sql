/* Replace with your SQL commands */
CREATE TABLE sockets (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id varchar(255) NOT NULL,
    socket varchar(255) NOT NULL,
    chat_id INTEGER DEFAULT NULL
);