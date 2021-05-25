#!/bin/bash

cd /usr/local/nebula-dashboard/
npm run start
nohup ./vendors/nebula-http-gateway/nebula-http-gateway &
