#!/bin/bash

DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="postgres"
DB_HOST="localhost"
DB_PORT="5432"

TABLES="report,poi,staff,sms_messages"

for TABLE in $TABLES; do
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    TRUNCATE TABLE $TABLE CASCADE;"
done


