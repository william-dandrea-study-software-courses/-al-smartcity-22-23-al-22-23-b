#!/bin/bash


docker-compose --project-name smartcity-prod \
               --file ./docker-compose-prod.yml \
               down -v
