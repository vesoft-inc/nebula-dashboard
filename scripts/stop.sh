#!/bin/bash

# stop nebula-http-gateway
kill -9 $(lsof -t -i :8090)

# stop nebula-dashboard
kill -9 $(lsof -t -i :7003)

