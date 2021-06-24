<<<<<<< HEAD
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
  $ cd node-exporter
  $ nohup ./node-exporter --web.listen-address=":9100" &
  ```
  Service address: http://127.0.0.1:9100

2. Nebula-stats-exporter：for nebula graph metrics
- packages: `nebula-stats-exporter`
- location：in the same machine with nebula-graph-dashboard
- dependency: modify ：`config.yml` according to nebula graph service address
  Start：
  ```bash
  $ cd nebula-stats-exporter
  $ nohup  ./nebula-stats-exporter --listen-address=":9200" --bare-metal --bare-metal-config=./config.yaml &
  ```
  Service address: http://127.0.0.1:9200

3. Prometheus
- packages `prometheus`
- location：in the same machine with nebula-graph-dashboard
- dependency：modify ：`./vendors/prometheus/prometheus.yaml` according to node-exporter and nebula-stats-exporter service address
- Start：
=======
# Nebula Dashboard 部署文档（Linux)

## 下载
` wget https://oss-cdn.nebula-graph.com.cn/nebula-graph-dashboard/nebula-graph-dashboard-beta.tar.gz`

## 解压
`tar -xvf nebula-graph-dashboard-beta.tar.gz`


## 目录结构说明
根目录 nebula-graph-dashboard 下一共五个安装包
- nebula-graph-dashboard ------------------------- 监控平台服务
- nebula-stats-exporter --------------------- Nebula Graph指标采集服务
- node-exporter ----------------------------- 机器指标采集服务
- prometheus -------------------------------- 监控指标存储服务平台
- nebula-http-gateway


## 开始部署

1. 部署 node-exporter 服务采集机器指标
- 安装包：使用 `node-exporter`
- 部署位置：集群里每个需要监控节点机器均需要部署
- 启动方式：
  ```bash
  // 把对应 node-exporter 包放到需要监控采集指标的机器上，启动采集服务
  $ cd node-exporter
  $ nohup ./node-exporter --web.listen-address=:9200 &
  ```
  启动服务本机地址: http://127.0.0.1:9200

2. 部署服务 nebula-stats-exporter 采集nebula指标
- 安装包: `nebula-stats-exporter`
- 部署位置：与nebula-graph-dashboard部署在同一台机器即可
- 依赖配置: 需要根据nebula服务部署的节点地址来配 `config.yml`
  启动方式：
  ```bash
  $ cd nebula-stats-exporter
  $ nohup  ./nebula-stats-exporter  --bare-metal --bare-metal-config=./config.yaml &
  ```
  启动服务本机地址: http://127.0.0.1:9100

3. 部署服务 prometheus
- 安装包：`prometheus`
- 部署位置：与nebula-graph-dashboard部署在同一台机器即可
- 依赖配置：需要根据实际 node-exporter 和 nebula-stats-exporter 的服务ip地址，修改：`./vendors/prometheus/prometheus.yml`
- 启动方式：
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
  ```bash
  $ cd prometheus
  $ nohup ./prometheus --config.file=./prometheus.yaml &
  ```
<<<<<<< HEAD
  Service address: http://127.0.0.1:9090

4. Nebula-http-gateway
- packages: `nebula-http-gateway`
- location：in the same machine with nebula-graph-dashboard
- Start：
=======
  启动服务地址: http://127.0.0.1:9090

4. 部署 nebula-http-gateway
- 安装包: `nebula-http-gateway`
- 部署位置：与nebula-graph-dashboard部署在同一台机器即可
- 启动方式：
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
  ```bash
  $ cd nebula-http-gateway
  $ nohup ./nebula-httpd &
  ```
<<<<<<< HEAD
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
- Start:
=======
- 启动服务地址: http://127.0.0.1:8090

5. 部署 nebula-graph-dashboard
- 安装包: `nebula-graph-dashboard`
- 启动方式:
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
  ```bash
  $ cd nebula-graph-dashboard
  $ npm run start
  ```
<<<<<<< HEAD
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
$ cd nebula-graph-dashboard
$ npm run stop # stop nebula-graph-dashboard
=======
- 启动服务地址: http://127.0.0.1:7003

6. 浏览器访问 Nebula Dashboard
访问 http://{{ip}}:7003


## 停止服务
目前先通过 `kill -9 pid` 的方式来关停服务：

```bash
$ kill -9 $(lsof -t -i :9200) # 停止 node-exporter 服务
$ kill -9 $(lsof -t -i :9100) # 停止 nebula-stats-exporter 服务
$ kill -9 $(lsof -t -i :9090) # 停止 prometheus 服务
$ kill -9 $(lsof -t -i :8090) # 停止 nebula-http-gateway
$ cd nebula-graph-dashboard
$ npm run stop # 停止 nebula-graph-dashboard
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
```


