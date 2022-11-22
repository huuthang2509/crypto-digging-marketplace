#!/bin/bash

set -eo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
ENV_FILE=".env"

# export all the env vars
export $(cat $ENV_FILE | grep -v '#' | awk '/=/ {print $1}')

sudo docker compose -p crypto-digging -f docker-compose.yaml -f docker-compose.dev.yaml build --no-cache
sudo docker compose -p crypto-digging -f docker-compose.yaml -f docker-compose.dev.yaml up -d

sleep 15
./scripts/migrate.sh
#sudo docker system prune -f