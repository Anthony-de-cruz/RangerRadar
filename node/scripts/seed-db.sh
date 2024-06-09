#!/bin/bash

DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="postgres"
DB_HOST="localhost"
DB_PORT="5432"

PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
INSERT INTO staff (username, password, phone_number)
VALUES ('staff1', 'password', '123'),
       ('staff2', 'password', '123'),
       ('staff3', 'password', '123'),
       ('staff4', 'password', '123');"

PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
INSERT INTO poi (name, latitude, longitude)
VALUES ('Community hall', 12.577755393501226, 106.93505719778429),
       ('Bobs house', 12.576312836007656, 106.93096736277252),
       ('South west footbridge', 12.57491024837709, 106.92981586958277),
       ('Lees farm', 12.573616022917733, 106.9394137348408),
       ('West bridge', 12.586860320934704, 106.92452794691219);"

PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
INSERT INTO report (report_type, severity, latitude, longitude)
VALUES ('logging', 'low', 12.589457615153112, 106.94408078898738),
       ('logging', 'moderate', 12.603731768277791, 106.88698846184853),
       ('logging', 'high', 12.600551999463363, 106.89435676001462),
       ('poaching', 'moderate', 12.59923246286416, 106.92314087950948),
       ('mining', 'moderate', 12.584769462787865, 106.90548062324525),
       ('erw', 'high', 12.585462489145392, 106.92119438433278);"

