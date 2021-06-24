#!/usr/bin/env bash

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
<<<<<<< HEAD
chmod 755 $DASHBOARD/vendors/nebula-stats-exporter/nebula-stats-exporter
=======
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
mv  $DASHBOARD/vendors/nebula-stats-exporter/ $TARGET/

### node-exporter
mv  $DASHBOARD/vendors/node-exporter/ $TARGET/

# prometheus
mv $DASHBOARD/vendors/prometheus/ $TARGET/

<<<<<<< HEAD
### Nebula Graph Dashboard relative ###
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
bash ./scripts/setEventTracking.sh $1

=======
### nebula dashboard relative ###
cd $DASHBOARD
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
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
<<<<<<< HEAD
tar -czf nebula-graph-dashboard-$VERSION.x86_64.tar.gz nebula-graph-dashboard
=======
tar -czf nebula-graph-dashboard-beta.tar.gz nebula-graph-dashboard
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
