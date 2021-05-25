#!/bin/bash

# will exec before dashboard rpm rm

# kill nebula-http-gateway server
set +e
cd /usr/local/nebula-dashboard/
bash ./scripts/stop.sh
set -e
