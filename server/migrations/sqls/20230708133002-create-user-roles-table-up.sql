/* Replace with your SQL commands */
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    status ENUM('admin', 'manager', 'support', 'user')
);