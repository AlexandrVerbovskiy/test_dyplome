/* Replace with your SQL commands */
CREATE TABLE messages (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(255) NOT NULL,
    time_created timestamp DEFAULT CURRENT_TIMESTAMP
);