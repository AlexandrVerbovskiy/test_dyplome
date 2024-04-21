/* Replace with your SQL commands */
CREATE TABLE users_actions (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `data` TEXT,
    `key` TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id),
);