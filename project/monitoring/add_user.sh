until mongo --host smartcity-prod-database --eval "print(\"waited for connection\")"
do
    sleep 1
done



echo "Adding user to MongoDB..."
mongo --host smartcity-prod-database --eval 'db.createUser({user: "exporter", pwd: "password", roles: [ { role: "clusterMonitor", db: "admin" }, { role: "read", db: "local" } ] } )'
echo "User added."
