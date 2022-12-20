#!/bin/bash


function function_to_execute() {
  echo $1
  cd $1 || exit
  npm i --save kafkajs

  cd ../..
}

function_to_execute "./main/anti-fraud-analyzer"
function_to_execute "./main/billing-handler"
function_to_execute "./main/car-tracker"
function_to_execute "./main/client-communication-service"
function_to_execute "./main/route-advisor"
function_to_execute "./main/tracking-analytics"
function_to_execute "./main/tracking-shutdown"
function_to_execute "./main/user-client"
function_to_execute "./main/user-configurator"
function_to_execute "./main/user-position-proxy"
function_to_execute "./mocks/camera-checker"
function_to_execute "./mocks/zones-pollution-extern"
