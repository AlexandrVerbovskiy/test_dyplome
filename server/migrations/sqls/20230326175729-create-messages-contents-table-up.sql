/* Replace with your SQL commands */
CREATE TABLE messages_contents (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    message_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    time_edited timestamp DEFAULT CURRENT_TIMESTAMP
);