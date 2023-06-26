/* Replace with your SQL commands */
CREATE TABLE disputes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_request_id INT NOT NULL,
    user_id INT NOT NULL,
    admin_id INT,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_request_id) REFERENCES job_requests(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);