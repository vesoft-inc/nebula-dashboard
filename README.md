# Nebula Graph Dashboard
Nebula Dashboard is a tool that assists Nebula Graph service operation and maintenance personnel in daily service monitoring and management

## Quick Start

### Service Dependency
#### Linux
- node.js (>= 10.12.0)
- Linux

- [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway) - Nebula-graph network service
  start service at port 8090，replace http-gateway [app.conf](https://github.com/vesoft-inc/nebula-http-gateway/blob/master/conf/app.conf) with [gateway.conf](./vendors/gateway.conf)

- [node-exporter](./vendors/node-exporter/) - Machine metric data service
  Start command：`./vendors/node-exporter/node-exporter --web.listen-address=:9200`

- [nebula-stats-exporter](./vendors/nebula-stats-exporter) - Nebula graph metrics data service
  Get metrics from nebula service，documentation:[Metrics Exporter](https://docs.nebula-graph.io/1.1/manual-EN/3.build-develop-and-administration/7.monitor/1.metrics-exposer/)，modify [nebula-stats-exporter](./vendors/nebula-stats-exporter/config.yaml)
  Example：
  ```
  version: v0.0.3
  nebulaItems:
    - instanceName: metad0 // instance name as a symble
      endpointIP: 10.17.101.126 // metrics service IP
      endpointPort: 32839 // metrics service Ports
      componentType: metad // metrics service type, should be one of metad,graphd or storaged
  ```
  Start command：`./vendors/nebula-stats-exporter/nebula-stats-exporter  --bare-metal --bare-metal-config=./config.yaml`

  
- [prometheus](./vendors/prometheus/prometheus) - Save metrics data service
  Modify setting：according to node-exporter 和 nebula-stats-exporter ip and port modify[prometheus.yaml](./vendors/prometheus/prometheus.yaml)
  
**Strongly recommend start service in Linux System**
#### MacOS 
- node.js (>= 10.12.0)
- Go 1.13+ and beego

- [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway) 
  refer: [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway)
  nebula-httpgate-way port should be 8090

- [nebula-stats-exporter](https://github.com/vesoft-inc/nebula-stats-exporter) 
  refer:[nebula-stats-exporter](https://github.com/vesoft-inc/nebula-stats-exporter)

- node-exporter
```
  brew install node_exporter
  node_exporter --web.listen-address=":9200"
```

- prometheus
install
```
  brew install prometheus
```
  according to node-exporter and nebula-stats-exporter ip and port，modify[prometheus.yaml](./vendors/prometheus/prometheus.yaml)
Start
```  
  prometheus --config.file=/usr/local/etc/prometheus.yml
```

#### Windows
- node.js (>= 10.12.0)
- Go 1.13+ and beego

- [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway) - nebula-graph network service
  refer: [nebula-http-gateway](https://github.com/vesoft-inc/nebula-http-gateway)
  nebula-httpgate-way port should be 8090

- [nebula-stats-exporter](https://github.com/vesoft-inc/nebula-stats-exporter) - 
  refer:[nebula-stats-exporter](https://github.com/vesoft-inc/nebula-stats-exporter)

- prometheus
  Download: https://prometheus.io/download/
  set node-exporter port and nebula-stats-exporter port，start at prometheus directory
```
prometheus.exe --config.file=prometheus.yml
```


### Start nebula-graph-dashboard

Modify nebula-graph connecting setting
```
connection: {
  ip: '127.0.0.1', // change to nebula graph service ip
  port: 9669, // change to nebula graph service port
},
```
Start
```
$ npm install
$ npm run dev
```

## Use dashboard in Production
Refer：[Production Guide](DEPLOY.md)

## Documentation 

Dashboard Chinese document [on this website](https://docs.nebula-graph.com.cn/master/nebula-dashboard/1.what-is-dashboard/)
Dashboard English document [on this website](https://docs.nebula-graph.io/master/nebula-dashboard/1.what-is-dashboard/)