-- !psql

CREATE TYPE report_type AS ENUM ('erw', 'poaching', 'mining', 'logging');

CREATE TYPE report_severity AS ENUM ('low', 'moderate', 'high');

CREATE TABLE IF NOT EXISTS staff
(
    username     VARCHAR(20) NOT NULL,
    password     VARCHAR(20) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS report
(
    id             SERIAL                              NOT NULL,
    report_type    REPORT_TYPE                         NOT NULL,
    severity       REPORT_SEVERITY                     NOT NULL,
    time_of_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    latitude       FLOAT                               NOT NULL,
    longitude      FLOAT                               NOT NULL,
    resolved       BOOLEAN   DEFAULT FALSE             NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS poi
(
    name      VARCHAR(255) NOT NULL,
    latitude  FLOAT        NOT NULL,
    longitude FLOAT        NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS sms_messages
(
    internal_id SERIAL NOT NULL,
    api_message_id        VARCHAR(16)  NOT NULL,
    msisdn            VARCHAR(12)  NOT NULL,
    recipient         VARCHAR(12)  NOT NULL,
    text              VARCHAR(160) NOT NULL,
    type              VARCHAR(64)  NOT NULL,
    keyword           VARCHAR(160) NOT NULL,
    api_key           VARCHAR(64)  NOT NULL,
    message_timestamp TIMESTAMP    NOT NULL,
    PRIMARY KEY (internal_id)
);

SELECT * FROM staff;
