/* Replace with your SQL commands */
CREATE TABLE get_money_requests (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    money DECIMAL NOT NULL,
    platform VARCHAR(255) NOT NULL,
    user_transaction_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL DEFAULT "in_process",
    done_at TIMESTAMP DEFAULT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users (id)
    FOREIGN KEY (user_transaction_id) REFERENCES payment_transactions (id)
);