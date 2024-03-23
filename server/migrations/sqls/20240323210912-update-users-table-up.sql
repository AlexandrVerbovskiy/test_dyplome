/* Replace with your SQL commands */
ALTER TABLE users
ADD COLUMN `reset_password_token` varchar(255) DEFAULT NULL;