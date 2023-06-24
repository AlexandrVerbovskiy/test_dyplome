CREATE TABLE password_reset_links (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    account_id INTEGER NOT NULL,
    reset_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES users (id)
);