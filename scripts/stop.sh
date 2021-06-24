#!/bin/bash

# stop nebula-http-gateway
kill -9 $(lsof -t -i :8090)

# stop nebula-dashboard
kill -9 $(lsof -t -i :7003)

# stop nebula-stats-exporter
kill -9 $(lsof -t -i :9100)

# stop node-exporter
kill -9 $(lsof -t -i :9200)

# stop prometheus
kill -9 $(lsof -t -i :9090)

