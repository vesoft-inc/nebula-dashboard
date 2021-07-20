#!/bin/bash

# stop nebula-http-gateway
kill $(lsof -t -i :8090)

# stop nebula-dashboard
kill $(lsof -t -i :7003)

# stop nebula-stats-exporter
kill $(lsof -t -i :9100)

# stop node-exporter
kill $(lsof -t -i :9200)

# stop prometheus
kill $(lsof -t -i :9090)

