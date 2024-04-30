/* Replace with your SQL commands */
CREATE TABLE payment_transactions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    money DECIMAL NOT NULL,
    operation_type VARCHAR(255) NOT NULL,
    balance_change_type VARCHAR(255) NOT NULL,
    transaction_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);