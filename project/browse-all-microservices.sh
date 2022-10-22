#!/bin/bash


function function_to_execute() {
  echo $1
  cd $1 || exit
  npm i --save amqplib amqp-connection-manager
  npm i --save @nestjs/microservices
  cd ../..
}

function_to_execute "main/billing-handler"
function_to_execute "main/car-tracker"
function_to_execute "main/pollution-zone-aggregator"
function_to_execute "main/position-checker"
function_to_execute "main/tracking-shutdown"
function_to_execute "main/user-client"
function_to_execute "mocks/camera-checker"
function_to_execute "mocks/pollution-zones-emitter"
