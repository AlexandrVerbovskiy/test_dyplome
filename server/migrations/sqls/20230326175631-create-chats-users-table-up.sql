/* Replace with your SQL commands */
CREATE TABLE chats_users (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    time_created timestamp DEFAULT CURRENT_TIMESTAMP
    typing BOOLEAN DEFAULT false,
);