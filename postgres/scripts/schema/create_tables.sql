-- !psql

CREATE TABLE IF NOT EXISTS staff
(
    username     VARCHAR(20)           NOT NULL,
    password     VARCHAR(20)           NOT NULL,
    PRIMARY KEY (username)
);
