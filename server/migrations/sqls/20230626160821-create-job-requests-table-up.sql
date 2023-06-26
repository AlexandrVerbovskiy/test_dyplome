/* Replace with your SQL commands */
CREATE TABLE job_requests (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    job_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    price DOUBLE NOT NULL,
    execution_time INTEGER NOT NULL,
    status ENUM('Pending', 'Rejected', 'Completed', 'In Progress', 'Cancelled', 'Awaiting Execution Confirmation', 'Awaiting Cancellation Confirmation') NOT NULL,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);