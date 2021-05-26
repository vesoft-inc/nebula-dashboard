# Nebula Dashboard

## 简介
用于 Nebula 服务及机器监控

## 开发

### 环境准备
- docker
- golang
- node.js

### 准备依赖的服务
1. 启动一个nebula 2.x服务

2. 从nebula服务中找到对应的metrics接口，文档可参考[Metrics Exporter](https://docs.nebula-graph.io/1.1/manual-EN/3.build-develop-and-administration/7.monitor/1.metrics-exposer/)，修改 [nebula-stats-exporter](vendors/nebula-stats-exporter/config/config.yml)

比如：
```
version: v0.0.3
nebulaItems:
  - instanceName: metad0 // 标识
    endpointIP: 10.17.101.126 // 将其换成对应IP
    endpointPort: 32839 // 找到对应metrics的端口号
    componentType: metad // 确定当前填写metrics接口的类型
```

3. 填写好nebula exporter config.yml配置后，启动nebula-stats-exporter服务
```
docker run --restart=always -p 9100:9100 -v {你的绝对路径}/nebula-dashboard/vendors/nebula-stats-exporter/config:/config megabyte875/nebula-stats-exporter:v0.0.3 --bare-metal --bare-metal-config-path=/config/config.yml
```
启动后，服务端口是9100

4. 安装系统对应版本的 node-exporter 到 `./vendors/` 目录下
   参考文档: https://prometheus.io/docs/guides/node-exporter/

5. 启动node_exporter服务，进行机器数据监控
```
./node_exporter --web.listen-address=:9200
```

6. 配置 [prometheus.yml](vendors/nebula-stats-exporter/config/prometheus.yml)
把两个 exporter服务 与其做关联:
- nebula-stats-exporter: 监控输出nebula服务的指标数据
- nodex-exporter: 监控输出机器相关指标数据

```yaml
...
    static_configs:
      - targets: [
          '192.168.3.49:9100',  # nebula-stats-exporter metrics endpoints
          '192.168.3.49:9200'
        ]
...

```

7. 启动 prometheus 服务
docker run --name=prometheus --restart=always -p 8090:8090 -v {项目目录路径}/vendors/nebula-stats-exporter/config:/etc/prometheus/ prom/prometheus
