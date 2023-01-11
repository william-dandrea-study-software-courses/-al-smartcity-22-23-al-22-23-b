curl -o ./run_manager/osmr/ile-de-france.osm.pbf https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf

docker run -v $(pwd)/run_manager/osmr:/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/ile-de-france.osm.pbf
docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-partition /data/ile-de-france.osm
docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-customize /data/ile-de-france.osm
