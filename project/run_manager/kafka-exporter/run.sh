#!/bin/sh
while ! bin/kafka_exporter; do
    echo "Waiting for the Kafka cluster to come up..."
    sleep 10
done
