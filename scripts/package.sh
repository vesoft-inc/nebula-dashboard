#!/usr/bin/env bash

set -ex

DIR=`pwd`
DASHBOARD=$DIR/source/nebula-dashboard

# build target dir
TARGET=$DIR/nebula-dashboard
mkdir $TARGET

### nebula-http-gateway ###
GATEWAY=$DIR/source/nebula-http-gateway
cd $GATEWAY
make
TARGET_GATEWAY=$TARGET/nebula-http-gateway
mkdir -p $TARGET_GATEWAY/conf
mv $DASHBOARD/vendors/gateway.conf $TARGET_GATEWAY/conf/app.conf
mv $GATEWAY/nebula-httpd $TARGET_GATEWAY/

### nebula-stat-exporter build ###
chmod 755 $DASHBOARD/vendors/nebula-stats-exporter/nebula-stats-exporter
mv  $DASHBOARD/vendors/nebula-stats-exporter/ $TARGET/

### node-exporter
mv  $DASHBOARD/vendors/node-exporter/ $TARGET/

# prometheus
mv $DASHBOARD/vendors/prometheus/ $TARGET/

### Nebula Graph Dashboard relative ###
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
bash ./scripts/setEventTracking.sh $1

npm install --unsafe-perm
npm run build
npm run tsc
cp -r $DASHBOARD $TARGET/
cp $DASHBOARD/DEPLOY.md $TARGET/

cd $TARGET/nebula-dashboard

# remove the no use file for deploy
rm -rf ./.git ./src
# mkdir -p ./app/assets/
# index.html need to be saved
# cp $DASHBOARD/app/assets/index.html  ./app/assets/

### tar
cd $DIR
tar -czf nebula-dashboard-$VERSION.x86_64.tar.gz nebula-dashboard