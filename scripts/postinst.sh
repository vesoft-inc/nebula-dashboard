#!/bin/bash

# will exec when dashboard rpm installed
cd /usr/local/nebula-dashboard/
chmod 755 ./vendors/nebula-http-gateway/nebula-http-gateway
chmod 777 ./tmp/
chmod 777 ./static/customize.json
chmod 777 ./static/annotationLine.json
tar -xzvf node_modules.tar.gz
