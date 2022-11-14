#!/bin/bash

echo "Enter 1 if you want to build and run, 2 if you want to run"
read value

if [ $value -eq 1 ]
then
  docker-compose --project-name smartcity-dev --file ./docker-compose-dev.yml build --parallel
fi

docker-compose --project-name smartcity-dev --file ./docker-compose-dev.yml up -d

# docker exec -it car-tracker-bus rabbitmq-plugins enable rabbitmq_prometheus
