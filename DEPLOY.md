## Prerequisites

Before you deploy Dashboard, you must confirm that:

- The NebulaGraph services are deployed and started. For more information, see [NebulaGraph Database Manual](https://docs.nebula-graph.io/master/4.deployment-and-installation/1.resource-preparations/).

- Before the installation starts, the following ports are not occupied.
  
  - 9200

  - 9100

  - 9090

  - 8090

  - 7003


- The node-exporter is installed on the machines to be monitored. For details on installation, see [Prometheus document](https://prometheus.io/docs/guides/node-exporter/).

## Steps
1. Download the tar package[nebula-dashboard-{{ dashboard.release }}.x86_64.tar.gz](https://oss-cdn.nebula-graph.com.cn/nebula-graph-dashboard/{{ dashboard.release }}/nebula-dashboard-{{ dashboard.release }}.x86_64.tar.gz)  as needed.

2. Run `tar -xvf nebula-dashboard-{{ dashboard.release }}.x86_64.tar.gz` to decompress the installation package.

3. Modify the `config.yaml` file in `nebula-dashboard`.

  The configuration file contains the configurations of four dependent services and configurations of clusters. The descriptions of the dependent services are as follows.

  |Service|Default port| Description|
  |:---|:---|:---|
  |nebula-http-gateway |8090| Provides HTTP ports for cluster services to execute nGQL statements to interact with the NebulaGraph database. |
  |nebula-stats-exporter |9200| Collects the performance metrics in the cluster, including the IP addresses, versions, and monitoring metrics (such as the number of queries, the latency of queries, the latency of heartbeats, and so on). |
  |node-exporter |9100| Collects the source information of nodes in the cluster, including the CPU, memory, load, disk, and network. |
  |prometheus |9090| The time series database that stores monitoring data. |

  The descriptions of the configuration file are as follows.

  ```yaml
  port: 7003   # Web service port.
  gateway:
    ip: hostIP   # The IP of the machine where the Dashboard is deployed.
    port: 8090
    https: false  # Whether to enable HTTPS.
    runmode: dev  # Program running mode, including dev, test, and prod. It is used to distinguish between different running environments generally.
  stats-exporter:
    ip: hostIP   # The IP of the machine where the Dashboard is deployed.
    nebulaPort: 9200
    https: false  # Whether to enable HTTPS.
  node-exporter:
    - ip: nebulaHostIP_1 # The IP of the machine where the NebulaGraph is deployed.
      port: 9100
      https: false # Whether to enable HTTPS.
  # - ip: nebulaHostIP_2
  #   port: 9100
  #   https: false
  prometheus:
    ip: hostIP    # The IP of the machine where the Dashboard is deployed.
    prometheusPort: 9090
    https: false  # Whether to enable HTTPS.
    scrape_interval: 5s  # The interval for collecting the monitoring data, which is 1 minute by default.
    evaluation_interval: 5s  # The interval for running alert rules, which is 1 minute by default.
  # Cluster node info
  nebula-cluster:
    name: 'default' # Cluster name
    metad:
      - name: metad0
        endpointIP: nebulaMetadIP  # The IP of the machine where the Meta service is deployed.
        port: 9559
        endpointPort: 19559
    # - name: metad1
    #   endpointIP: nebulaMetadIP
    #   port: 9559
    #   endpointPort: 19559  
    graphd:
      - name: graphd0
        endpointIP: nebulaGraphdIP  # The IP of the machine where the Graph service is deployed.
        port: 9669
        endpointPort: 19669
    # - name: graphd1
    #   endpointIP: nebulaGraphdIP
    #   port: 9669
    #   endpointPort: 19669  
    storaged:
      - name: storaged0
        endpointIP: nebulaStoragedIP  # The IP of the machine where the Storage service is deployed.
        port: 9779
        endpointPort: 19779
    # - name: storaged1
    #   endpointIP: nebulaStoragedIP
    #   port: 9779
    #   endpointPort: 19779  
  ```

4. Run `./dashboard.service start all` to start the services.
5. Execute `sudo ./dashboard.service status all` to view the service startup status, after displaying all services RUNNING, visit `http://ip:7003` with the browser to view the Dashboard page.

### Deploy Dashboard with Docker Compose
If you are deploying Dashboard using docker, you should also modify the configuration file `config.yaml`, and then run `docker-compose up -d` to start the container.

> If you change the port number in `config.yaml`, the port number in `docker-compose.yaml` needs to be consistent as well.

Run `docker-compose stop` to stop the container.

## Manage services in Dashboard

You can use the `dashboard.service` script to start, restart, stop, and check the Dashboard services.

```bash
$ sudo <dashboard_path>/dashboard.service
[-v] [-h]
<start|stop|status>  <prometheus|webserver|exporter|gateway|all>
```

| Parameter                  | Description       |
| :------------------------- | :------------------- |
| `dashboard_path` | Dashboard installation path.  |
| `-v`                       | Display detailed debugging information.   |
| `-h`                       | Display help information.        |
| `start`                    | Start the target services.       |
| `restart`                  | Restart the target services.       |
| `stop`                     | Stop the target services.           |
| `status`                   | Check the status of the target services.       |
| `prometheus`               | Set the prometheus service as the target service. |
| `webserver`                | Set the webserver Service as the target service.  |
| `exporter`                 | Set the exporter Service as the target service.   |
| `gateway`                  | Set the gateway Service as the target service.    |
| `all`                      | Set all the Dashboard services as the target services.       |

> To view the Dashboard version, run the command `./dashboard.service -version`.
