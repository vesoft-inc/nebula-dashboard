# Nebula Graph Dashboard Production Guide（Linux)

## Environment
- Node.js (>= 10.12.0)
- Linux

## Download
` wget https://oss-cdn.nebula-graph.com.cn/nebula-graph-dashboard/nebula-graph-dashboard-${version}.x86_64.tar.gz`

## Unpress
`tar -xvf nebula-graph-dashboard-${version}.x86_64.tar.gz`


## Directory descrption
Five packages in nebula-graph-dashboard 
- nebula-graph-dashboard ------------------------- FE service
- nebula-stats-exporter --------------------- Nebula Graph Metric Service
- node-exporter ----------------------------- Machine Metric Service
- prometheus -------------------------------- Data saving Service
- nebula-http-gateway ----------------------- Network Service

Attention: the file under these packages is compiled under Linux environment, can only be used in Linux. If you want to use dashboard in other enviroments, please download package according to [README.md](README.md)

## Quick Start

1. Node-exporter：for machine metrics
- packages： `node-exporter`
- location：if you want in cluster,each machine needs install node exporter
- Start：
  ```bash
  ## node-exporter should run in 
  $ cd /nebula-dashboard/vendors/node-exporter
  $ nohup ./node-exporter --web.listen-address=":9100" &
  ```
  Service address: http://127.0.0.1:9100

2. Nebula-stats-exporter：for nebula graph metrics
- packages: `nebula-stats-exporter`
- location：in the same machine with nebula-graph-dashboard
- dependency: modify ：`config.yml` according to nebula graph service address
  Start：
  ```bash
  $ cd /nebula-dashboard/vendors/nebula-stats-exporter
  $ nohup  ./nebula-stats-exporter --listen-address=":9200" --bare-metal --bare-metal-config=./config.yaml &
  ```
  Service address: http://127.0.0.1:9200

3. Prometheus
- packages `prometheus`
- location：in the same machine with nebula-graph-dashboard
- dependency：modify ：`./vendors/prometheus/prometheus.yaml` according to node-exporter and nebula-stats-exporter service address
- Start：
  ```bash
  $ cd /nebula-dashboard/vendors/prometheus
  $ nohup ./prometheus --config.file=./prometheus.yaml &
  ```
  Service address: http://127.0.0.1:9090

4. Nebula-http-gateway
- packages: `nebula-http-gateway`
- location：in the same machine with nebula-graph-dashboard
- Start：
  ```bash
  $ cd /nebula-dashboard/vendors/nebula-http-gateway
  $ nohup ./nebula-httpd &
  ```
- Service address: http://127.0.0.1:8090

5. nebula-graph-dashboard
- packages: `nebula-graph-dashboard`
- setting: `./static/custom.json`
  ```javascript
    connection: {
      ip: '127.0.0.1', // change to running nebula graph address
      port: 9669, // change to running nebula graph port
    },
  ```

- Modify proxy setting: `./vendors/config-release.yaml`
  ```
  port: 7003
  proxy:
    gateway:
      target: "127.0.0.1:8090"  // change gateway service proxy
    prometheus:
      target: "127.0.0.1:9091"  // change prometheus service proxy
  ```
- Start:
  ```bash
  $ ./dashboard &
  ```
- service address: http://127.0.0.1:7003

1. Open Nebula Graph Dashboard in browser
url: http://{{ip}}:7003


## Stop Service
Using `kill pid` ：

```bash
$ kill $(lsof -t -i :9200) # stop nebula-stats-exporter  service
$ kill $(lsof -t -i :9100) # stop node-exporter service
$ kill $(lsof -t -i :9090) # stop prometheus service
$ kill $(lsof -t -i :8090) # stop nebula-http-gateway
$ kill $(lsof -t -i :7003) # stop nebula-graph-dashboard
```


