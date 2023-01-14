#!/bin/bash

echo "Enter 1 if you want to build and run, 2 if you want to run"
read value

if [ $value -eq 1 ]
then

  # curl -o ./run_manager/osmr/ile-de-france.osm.pbf https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf

  # docker run -v $(pwd)/run_manager/osmr:/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/ile-de-france.osm.pbf
  # docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-partition /data/ile-de-france.osm
  # docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-customize /data/ile-de-france.osm

  docker-compose --project-name smartcity-dev --file ./docker-compose-dev.yml build --parallel
fi

docker-compose --project-name smartcity-dev --file ./docker-compose-dev.yml up -d

# docker exec -it car-tracker-bus rabbitmq-plugins enable rabbitmq_prometheus
