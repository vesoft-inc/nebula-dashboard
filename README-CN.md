<p align="center">
  <img src="https://www-cdn.nebula-graph.com.cn/nebula-website-5.0/images/dashboard-repo-logo.png"/>
  <br>中文 | <a href="README.md">English</a>
  <br>一款用于监控 NebulaGraph 集群中机器和服务状态的可视化工具。<br>
</p>

# NebulaGraph Dashboard是什么
**NebulaGraph Dashboard**（简称 Dashboard）是一款用于监控 NebulaGraph 集群中机器和服务状态，以及可视化查看集群服务信息的可视化管理工具。

## 产品功能
- 监控集群中所有机器的状态，包括 CPU、内存、负载、磁盘和流量。
- 监控集群中所有服务的信息，包括服务 IP 地址、版本和监控指标（例如查询数量、查询延迟、心跳延迟等）。
- 监控集群本身的信息，包括集群的服务信息、分区信息、配置和长时任务。
- 支持全局调整监控数据的页面更新频率。
- 查看集群的配置信息

## 适用场景
如果有以下任一需求，都可以使用 NebulaGraph Dashboard：
- 需要方便快捷地监测关键指标，集中呈现业务的多个重点信息，保证业务正常运行。
- 需要多维度（例如时间段、聚合规则、指标）监控集群。
- 故障发生后，需要复盘问题，确认故障发生时间、异常现象。

## 开始部署
- <a href="https://github.com/vesoft-inc/nebula-dashboard/releases" _blank>获取Dashboard安装包</a>
- <a href="DEPLOY-CN.md" _blank>部署Dashboard</a>

## 详细文档
NebulaGraph Dashboard的详细文档可以在 <a href= "https://docs.nebula-graph.com.cn/master/nebula-dashboard/2.deploy-dashboard/#docker_compose_dashboard">文档</a> 查看 

## 如何贡献

- <a href="CONTRIBUTE-CN.md" _blank>参与贡献</a>

## 版本兼容性
NebulaGraph 的版本和 Dashboard 社区版的版本对应关系如下。

|NebulaGraph 版本|Dashboard 版本|
|:---|:---|
|3.3.0        |3.2.0|
|2.5.0 ~ 3.2.0|3.1.0|
|2.5.x ~ 3.1.0|1.1.1|
|2.0.1 ~ 2.5.1|1.0.2|
|2.0.1 ~ 2.5.1|1.0.1|

## 界面预览

<img src="https://www-cdn.nebula-graph.com.cn/nebula-website-5.0/images/nebula-dashboard-login.png"/>

<br />

<img src="https://docs-cdn.nebula-graph.com.cn/figures/overview1-221103-cn.png"/>