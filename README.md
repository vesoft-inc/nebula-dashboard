# Nebula Graph Dashboard
Nebula Graph Dashboard is a tool that assists Nebula Graph service operation and maintenance personnel in daily service monitoring and management

## Use dashboard in Production
If you use dashboard in Production Env,Refer to：[Production Guide](DEPLOY.md)

## Development 
#### Prerequisites
- Node.js (>= 10.12.0)
- Go 1.13+ and beego
#### Quick Start
1. Start nebula service
2. Start nebula-http-gateway(Nebula Graph network service)

    - Download nebula-http-gateway
    ```
    $ git clone https://github.com/vesoft-inc/nebula-http-gateway.git
    ```
  
    - Modify httpport part in the `nebula-http-gateway/conf/app.conf` under the installation directory
    ```
    httpport = 8090
    ```
    - Build
    ```
    $ cd /path/to/nebula-http-gateway
    $ make
    ```
    - Run 
    ```
    $ ./nebula-httpd
    ```

3. Start node-exporter(Machine metric data service)
    - Download [node_exporter](https://prometheus.io/download/#node_exporter) according to your environment
    - Run 
  
    ```
      $ tar -xvf node_exporter-{version}.tar.gz
      $ cd node_exporter-{version}
      $ ./node_exporter --web.listen-address=":9100"
    ```

4. Start nebula-stats-exporter (Nebula Graph metrics data service)

    - Download nebula-stats-exporter and build
    ```
    $ git clone https://github.com/vesoft-inc/nebula-stats-exporter.git
    $ cd nebula-stats-exporter
    $ make build
    ```

    - Modify `/vendors/nebula-stats-exporter/config.yaml` under nebula-graph-dashboard directory
    ```
    # Example:
    version: v0.0.3
    nebulaItems:
      - instanceName: metad0 // instance name as a symble
        endpointIP: 10.17.101.126 // metrics service IP
        endpointPort: 32839 // metrics service Ports
        componentType: metad // metrics service type, should be one of metad,graphd or storaged
    ```
    - run
    ```
    ./nebula-stats-exporter --listen-address=":9200" --bare-metal --bare-metal-config={pwd}/nebula-graph-dashboard/vendors/nebula-stats-exporter/config.yaml &
    ```

  
5. Start prometheus(Save metrics data service)
    - Download [prometheus](https://prometheus.io/download/#prometheus) according to your environment

    - Modify `/vendors/prometheus/prometheus.yaml` according to node-exporter and nebula-stats-exporter ip and port config

    - Run
    ```
    $ tar -xvf prometheus-${version}.tar.gz
    $ cd prometheus-{version}
    $ ./prometheus --config.file={pwd}/nebula-graph-dashboard/vendors/nebula-stats-exporter/config.yaml &
    ```
6. Start nebula-graph-dashboard

    - Modify nebula-graph connecting setting
    setting: `./static/custom.json`
    ```
    connection: {
      ip: '127.0.0.1', // change to nebula graph service ip
      port: 9669, // change to nebula graph service port
    },
    ```
    - Start
    ```
    $ npm install
    $ npm run dev
    ```

**Do not run ./scripts/*.sh in development environment**
## Documentation 

+ [中文](https://docs.nebula-graph.com.cn/master/nebula-dashboard/1.what-is-dashboard/)

+ [English](https://docs.nebula-graph.io/master/nebula-dashboard/1.what-is-dashboard/)