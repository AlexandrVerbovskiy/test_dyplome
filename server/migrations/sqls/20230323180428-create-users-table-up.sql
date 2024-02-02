CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    nick varchar(255) DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    avatar varchar(255) DEFAULT NULL,
    lat double DEFAULT NULL,
    lng double DEFAULT NULL,
    profile_authorized boolean DEFAULT false,
    online BOOLEAN DEFAULT false,
    `admin` BOOLEAN DEFAULT false,
    time_created timestamp DEFAULT CURRENT_TIMESTAMP
);