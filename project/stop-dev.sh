#!/bin/bash


docker-compose --project-name smartcity-dev \
               --file ./docker-compose-dev.yml \
               down -v
