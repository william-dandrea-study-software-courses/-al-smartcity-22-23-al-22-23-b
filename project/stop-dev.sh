#!/bin/bash


docker-compose --project-name smartcity-dev \
               --file ./docker-compose-dev.yml \
               down -v

# docker-compose up -d --no-deps --build <service_name>
