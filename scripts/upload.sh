set -ex

DIR=`pwd`
DASHBOARD=$DIR/source/nebula-dashboard
cd $DASHBOARD
VERSION=`cat package.json | grep '"version":' | awk 'NR==1{print $2}' | awk -F'"' '{print $2}'`
cd $DIR
ossutil64 -e $1 -i $2 -k $3 -f cp ./  $4${VERSION} --include "nebula-dashboard-*.tar.gz" --only-current-dir -r