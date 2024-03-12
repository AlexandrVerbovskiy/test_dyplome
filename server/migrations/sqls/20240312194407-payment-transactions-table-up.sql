/* Replace with your SQL commands */
CREATE TABLE payment_transactions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    money DECIMAL NOT NULL,
    status VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);