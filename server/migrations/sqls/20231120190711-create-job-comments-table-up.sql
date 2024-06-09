/* Replace with your SQL commands */
CREATE TABLE job_comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (job_id) REFERENCES jobs (id)
);