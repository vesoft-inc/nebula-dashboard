# Nebula Dashboard 部署文档（Linux)

## 环境依赖
- Node.js (>= 10.12.0)

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
  ```bash
  $ cd prometheus
  $ nohup ./prometheus --config.file=./prometheus.yaml &
  ```
  启动服务地址: http://127.0.0.1:9090

4. 部署 nebula-http-gateway
- 安装包: `nebula-http-gateway`
- 部署位置：与nebula-graph-dashboard部署在同一台机器即可
- 启动方式：
  ```bash
  $ cd nebula-http-gateway
  $ nohup ./nebula-httpd &
  ```
- 启动服务地址: http://127.0.0.1:8090

5. 部署 nebula-graph-dashboard
- 安装包: `nebula-graph-dashboard`
- 配置: `./static/custom.json
  ```javascript
  ...
    connection: {
      ip: '127.0.0.1', // 改成对应需要连接 nebula graph 的地址
      port: 9669, // 改成对应nebula的端口
    },
  ...
  ```
- 启动方式:
  ```bash
  $ cd nebula-graph-dashboard
  $ npm run start
  ```
- 启动服务地址: http://127.0.0.1:7003

1. 浏览器访问 Nebula Dashboard
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
```


