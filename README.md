# Nebula Graph Dashboard

## 简介
用于 Nebula Graph 服务及机器监控

## 生产使用
参考：[安装部署指南](DEPLOY.md)

## 本地开发

### 环境准备
- node.js
- Linux

### 服务依赖
- [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway) - nebula-graph 网关服务
  需要配置启动8090的端口服务，将 [gateway.conf](./vendors/gateway.conf) 替换掉 gateway 项目中的 [app.conf](https://github.com/vesoft-inc/nebula-http-gateway/blob/master/conf/app.conf) 即可。

- [node-exporter](./vendors/node-exporter/) - 机器指标采集服务
  启动命令：`./vendors/node-exporter/node-exporter --web.listen-address=:9200`

- [nebula-stats-exporter](./vendors/nebula-stats-exporter) - nebula graph 指标采集服务
  从nebula服务中找到对应的metrics接口，文档可参考[Metrics Exporter](https://docs.nebula-graph.io/1.1/manual-EN/3.build-develop-and-administration/7.monitor/1.metrics-exposer/)，修改 [nebula-stats-exporter](./vendors/nebula-stats-exporter/config.yaml)
  比如：
  ```
  version: v0.0.3
  nebulaItems:
    - instanceName: metad0 // 标识
      endpointIP: 10.17.101.126 // 将其换成对应IP
      endpointPort: 32839 // 找到对应metrics的端口号
      componentType: metad // 确定当前填写metrics接口的类型
  ```
  启动命令：`./vendors/nebula-stats-exporter/nebula-stats-exporter  --bare-metal --bare-metal-config=./config.yaml`

  
- [prometheus](./vendors/prometheus/prometheus) - 监控指标存储服务
  修改配置：需要根据实际部署的 node-exporter 和 nebula-stats-exporter 的服务ip，修改[prometheus.yaml](./vendors/prometheus/prometheus.yaml)

### 启动 nebula-graph-dashboard
```
$ npm install
$ npm run dev
```