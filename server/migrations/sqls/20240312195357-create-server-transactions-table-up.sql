/* Replace with your SQL commands */
CREATE TABLE server_transactions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    money DECIMAL NOT NULL,
    operation_type VARCHAR(255) NOT NULL,
    balance_change_type VARCHAR(255) NOT NULL,
    transaction_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);