#!/bin/bash

cd /usr/local/nebula-dashboard/
nohup ./vendors/nebula-http-gateway/nebula-httpd &
nohup ./vendors/prometheus/prometheus  --storage.tsdb.path=/prometheus --web.console.libraries=/usr/share/prometheus/console_libraries --web.console.templates=/usr/share/prometheus/consoles --config.file=./vendors/prometheus/prometheus.yml &
nohup ./vendors/nebula-stats-exporter/nebula-stats-exporter  --bare-metal --bare-metal-config=./vendors/nebula-stats-exporter/config.yaml &
npm run start
