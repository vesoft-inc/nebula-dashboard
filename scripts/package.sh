#!/usr/bin/env bash

set -ex

DIR=`pwd`
DASHBOARD=$1
GATEWAY=$2
NIGHTLY=$3
GH_ID=$4

# build target dir
TARGET=$DIR/nebula-dashboard
mkdir $TARGET

### nebula-http-gateway ###
VENDOR_DIR=vendors
cd $GATEWAY
make
TARGET_GATEWAY=$TARGET/$VENDOR_DIR/nebula-http-gateway
mkdir -p $TARGET_GATEWAY/conf
mv $DASHBOARD/vendors/gateway.conf $TARGET_GATEWAY/conf/app.conf
mv $GATEWAY/nebula-httpd $TARGET_GATEWAY/

### nebula-stat-exporter build ###
chmod 755 $DASHBOARD/vendors/nebula-stats-exporter/nebula-stats-exporter
mv  $DASHBOARD/vendors/nebula-stats-exporter/ $TARGET/$VENDOR_DIR

### node-exporter
mv  $DASHBOARD/vendors/node-exporter/ $TARGET/$VENDOR_DIR

# prometheus
mv $DASHBOARD/vendors/prometheus/ $TARGET/$VENDOR_DIR
mv $DASHBOARD/docker-compose/docker-compose.yaml $TARGET/

### Nebula Graph Dashboard relative ###
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
bash $DASHBOARD/scripts/setEventTracking.sh $GH_ID

npm install --unsafe-perm
npm run build
cp -r public $TARGET/
cp $DASHBOARD/DEPLOY.md $TARGET/
npm run pkg
mv dashboard $TARGET/
cp -r $DASHBOARD/vendors/config-release.json $TARGET/config.json

### tar
cd $DIR
if [[ $NIGHTLY == "true" ]];then
  tar -czf nebula-dashboard-nightly.tar.gz nebula-dashboard
else
  tar -czf nebula-dashboard-$VERSION.x86_64.tar.gz nebula-dashboard
fi
