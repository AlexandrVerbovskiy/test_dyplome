/* Replace with your SQL commands */
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    body TEXT,
    link VARCHAR(255) DEFAULT NULL,
    title TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);