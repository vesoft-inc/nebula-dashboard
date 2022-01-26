#!/usr/bin/env bash

set -ex

DIR=`pwd`
DASHBOARD=$DIR/source/nebula-dashboard

# build target dir
TARGET=$DIR/nebula-dashboard
[[ -d $DASHBOARD ]] && rm -rf $DASHBOARD
[[ -d  $TARGET ]] && rm -rf $TARGET

mkdir $TARGET

### nebula-http-gateway ###
VENDOR_DIR=vendors
GATEWAY=$DIR/source/nebula-http-gateway
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

### Nebula Graph Dashboard relative ###
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
bash ./scripts/setEventTracking.sh $1

npm install --unsafe-perm
npm run build
cp -r public $TARGET/
cp $DASHBOARD/DEPLOY.md $TARGET/
npm run pkg
mv dashboard $TARGET/
cp -r vendors/config-release.json $TARGET/config.json

### tar
cd $DIR
tar -czf nebula-dashboard-$VERSION.x86_64.tar.gz nebula-dashboard