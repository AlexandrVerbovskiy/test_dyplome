/* Replace with your SQL commands */
CREATE TABLE employee_comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users (id),
    FOREIGN KEY (sender_id) REFERENCES users (id)
);