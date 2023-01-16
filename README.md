# Comment lancer le projet ?



## Backend
### Version de production
```shell
./launch.sh
```

### Version de developement

```shell
cd project
./start-dev.sh
```

WARNING : Si vous lancer le fichier start-dev.sh, vérifier bien que les volumes liées au conteneur OpenStreetMap (génération
d'itinéraire) est bien présent, sinon, dans le repository project, lancé les commandes :
```shell
curl -o ./run_manager/osmr/ile-de-france.osm.pbf https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pb
docker run -v $(pwd)/run_manager/osmr:/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/ile-de-france.osm.pbf
docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-partition /data/ile-de-france.osm
docker run -t -v $(pwd)/run_manager/osmr:/data  osrm/osrm-backend osrm-customize /data/ile-de-france.osm
```

Ces commandes sont en commentaire dans `start-dev.sh`. Si jamais ces étapes ci ne sont pas faites, le conteneur OpenStreetMap
ne fonctionnera pas. Cependant, si vous lancer `./launch.sh`, ces etapes sont faites (normalement) automatiquement

## Frontend 

```shell
cd project/main/user-client
npm run start
```

# Détails

Si vous souhaitez utiliser le même modèle que notre interface Grafana, vous trouverez notre dashboard au format JSON 
dans le fichier `grafana_dashboard.json`


### Important

Au moment du lancement, le service `kafka-exporter` se relancera plusieurs fois, c'est normal car il met du temps a se connecter au service Kafka, et donc du moment qu'il n'arrive pas a se connecter, il se redémarre (en general au bout de 1min tout est bon)
