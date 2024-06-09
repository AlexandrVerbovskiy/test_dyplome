/* Replace with your SQL commands */
CREATE TABLE sockets (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    socket varchar(255) NOT NULL,
    chat_id INTEGER DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (chat_id) REFERENCES chats (id)
);