ALTER TABLE chats_users
ADD COLUMN `delete_time` DATETIME DEFAULT NULL,
ADD COLUMN `role` varchar(255) DEFAULT NULL,
ADD COLUMN `last_viewed_message_id` INTEGER NOT NULL;