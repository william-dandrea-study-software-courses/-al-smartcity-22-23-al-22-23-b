#!/usr/bin/env sh

cd project || exit

docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml build
docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml up -d
