#!/usr/bin/env bash
echo "Creating users..."
mongosh admin --host localhost -u admin -p admin --eval "db.createUser({user: 'exporter', pwd: 'password', roles: [{ role: 'clusterMonitor', db: 'admin' }, { role: 'read', db: 'local' }, { role: 'read', db: 'tst' }]}); db.createUser({user: 'test', pwd: 'TEST', roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]});"
echo "Users created."
