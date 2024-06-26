/* Replace with your SQL commands */
CREATE TABLE reply_comments (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    parent_id INTEGER NOT NULL,
    reply_comment_id INTEGER DEFAULT NULL,
    parent_type VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id)
);