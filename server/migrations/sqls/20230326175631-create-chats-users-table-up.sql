/* Replace with your SQL commands */
CREATE TABLE chats_users (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    time_created timestamp DEFAULT CURRENT_TIMESTAMP
    typing BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (chat_id) REFERENCES chats (id)
);