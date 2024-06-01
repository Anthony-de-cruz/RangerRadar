#!/bin/bash
set -e

DB_HOST="localhost"
DB_PORT=5432
DB_USER=$POSTGRES_USER
DB_NAME=$POSTGRES_DB

# Restart the server to allow connections during initialisation
# https://github.com/docker-library/postgres/issues/474
# https://github.com/docker-library/postgres/issues/474#issuecomment-410725941
# https://github.com/docker-library/postgres/issues/474#issuecomment-410737234

echo "init-db.sh: Restarting server"

pg_ctl -o "-c listen_addresses='localhost'" -w restart

echo "init-db.sh: Executing initialisation scripts"

# Execute SQL scripts
echo "init-db.sh: Creating extensions"
psql -v ON_ERROR_STOP=1 -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /scripts/schema/create_extensions.sql
echo "init-db.sh: Creating tables"
psql -v ON_ERROR_STOP=1 -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /scripts/schema/create_tables.sql
echo "init-db.sh: Creating functions"
echo "init-db.sh: Creating procedures"
echo "init-db.sh: Creating triggers"
echo "init-db.sh: Seeding tables"

echo "init-db.sh: Database initialisation complete"
