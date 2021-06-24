#!/usr/bin/env bash
# package dashboard as one rpm

set -ex

DIR=`pwd`
DASHBOARD=$DIR/source/nebula-graph-dashboard

# build target dir
TARGET=$DIR/nebula-graph-dashboard
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
mv  $DASHBOARD/vendors/nebula-stats-exporter/ $TARGET/

### node-exporter
mv  $DASHBOARD/vendors/node-exporter/ $TARGET/

# prometheus
mv $DASHBOARD/vendors/prometheus/ $TARGET/

### nebula dashboard relative ###
cd $DASHBOARD
npm install --unsafe-perm
npm run build
npm run tsc
cp -r $DASHBOARD $TARGET/
cp $DASHBOARD/DEPLOY.md $TARGET/

cd $TARGET/nebula-graph-dashboard

# remove the no use file for deploy
rm -rf ./.git ./app/assets/
mkdir -p ./app/assets/
# index.html need to be saved
cp $DASHBOARD/app/assets/index.html  ./app/assets/

### tar
cd $DIR
tar -czf nebula-graph-dashboard-beta.tar.gz nebula-graph-dashboard