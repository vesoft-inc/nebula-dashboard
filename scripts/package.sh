#!/usr/bin/env bash

set -ex

DIR=`pwd`
DASHBOARD=$DIR/$1
GATEWAY=$DIR/$2
NIGHTLY=$3
CPU_ARCH=$4
GH_ID=$5


# build target dir
TARGET=$DIR/nebula-dashboard
mkdir $TARGET

### download dependencies
ORIGIN_DOWNLOAD_PATH=/root/downloads

### nebula-http-gateway ###
VENDOR_DIR=vendors
cd $GATEWAY
make
TARGET_GATEWAY=$TARGET/$VENDOR_DIR/nebula-http-gateway
mkdir -p $TARGET_GATEWAY/conf
mv $DASHBOARD/vendors/gateway.conf $TARGET_GATEWAY/conf/app.conf
mv $GATEWAY/nebula-httpd $TARGET_GATEWAY/

### download dependencies
DOWNLOAD_PATH=$TARGET/$VENDOR_DIR
cd $DOWNLOAD_PATH

### nebula-stat-exporter build ###
mv  $DASHBOARD/vendors/nebula-stats-exporter/ $DOWNLOAD_PATH
cp -r $ORIGIN_DOWNLOAD_PATH/nebula-stats-exporter-linux-$CPU_ARCH-v3.3.0 .
mv nebula-stats-exporter-linux-$CPU_ARCH-v3.3.0 $DOWNLOAD_PATH/nebula-stats-exporter/nebula-stats-exporter
chmod +x $DOWNLOAD_PATH/nebula-stats-exporter/nebula-stats-exporter

### node-exporter
mkdir node-exporter
cp -r $ORIGIN_DOWNLOAD_PATH/node_exporter-1.2.0.linux-$CPU_ARCH.tar.gz .
tar -xzvf node_exporter-1.2.0.linux-$CPU_ARCH.tar.gz
mv node_exporter-1.2.0.linux-$CPU_ARCH/node_exporter $DOWNLOAD_PATH/node-exporter/node_exporter
chmod +x $DOWNLOAD_PATH/node-exporter/node_exporter
rm -f node_exporter-1.2.0.linux-$CPU_ARCH.tar.gz
rm -rf node_exporter-1.2.0.linux-$CPU_ARCH

# prometheus
mv $DASHBOARD/vendors/prometheus/ $TARGET/$VENDOR_DIR
cp -r $ORIGIN_DOWNLOAD_PATH/prometheus-2.31.0.linux-$CPU_ARCH.tar.gz .
tar -xzvf prometheus-2.31.0.linux-$CPU_ARCH.tar.gz
mv prometheus-2.31.0.linux-$CPU_ARCH/prometheus $DOWNLOAD_PATH/prometheus/prometheus
chmod +x $DOWNLOAD_PATH/prometheus/prometheus
rm -f prometheus-2.31.0.linux-$CPU_ARCH.tar.gz
rm -rf prometheus-2.31.0.linux-$CPU_ARCH
mv $DASHBOARD/docker-compose/docker-compose.yaml $TARGET/

### NebulaGraph Dashboard relative ###
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
bash $DASHBOARD/scripts/setEventTracking.sh $GH_ID

npm install --unsafe-perm
npm run build
cp -r public $TARGET/
cp $DASHBOARD/DEPLOY.md $TARGET/
npm run pkg
mv dashboard.service $TARGET/
npm run pkg-webserver
mv bin $TARGET/
cp -r $DASHBOARD/vendors/config-release.yaml $TARGET/config.yaml

### tar
cd $DIR
if [[ $NIGHTLY == "true" ]];then
  tar -czf nebula-dashboard-nightly.tar.gz nebula-dashboard
else
  tar -czf nebula-dashboard-$VERSION.x86_64.tar.gz nebula-dashboard
fi
