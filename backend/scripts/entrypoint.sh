#!/bin/sh
./wait-for-it.sh db:3306 --timeout=30 -- echo "db is up"
alembic upgrade head
mysql -h db -u dataregistry -pdataregistry dataregistry < /app/test_data.sql
python -m dataregistry.main -e dataregistry/.env serve
