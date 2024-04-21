CREATE TABLE jobs (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    price double NOT NULL,
    address text NOT NULL,
    description text NOT NULL,
    lat double DEFAULT NULL,
    lng double DEFAULT NULL,
    author_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    time_created timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id),
);