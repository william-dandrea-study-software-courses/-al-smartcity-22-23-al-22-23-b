#!/bin/bash

echo "Enter 1 if you want to build and run, 2 if you want to run"
read value

if [ $value -eq 1 ]
then
  docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml build --parallel
fi

docker-compose --project-name smartcity-prod --file ./docker-compose-prod.yml up -d
