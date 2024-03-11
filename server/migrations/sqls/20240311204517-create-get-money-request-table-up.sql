/* Replace with your SQL commands */
CREATE TABLE get_money_requests (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    money DECIMAL NOT NULL,
    platform TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    done_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (sender_id) REFERENCES users (id)
);