# Nebula Dashboard
Nebula Dashboard 是基于 Prometheus 服务监控系统采集数据信息的可视化工具。通过使用 Nebula Dashboard，你可以实时监控服务机器的多项指标数据以及 nebula 的多项指标参数。

## 启动 Nebula Dashboard
启动基于 docker 镜像的 Nebula Dashboard，需要执行以下操作

  1. 启动 nebula 2.0 服务
  2. 安装系统对应版本的 node-exporter，启动并进行机器数据监控
  3. 启动 nebula-stats-exporter 服务，并依据 nebula 暴露出的相关接口修改配置
  4. 配置 prometheus 关联上述两个服务，并启动
  5. clone Nebula Dashboard repo
  6. 在 `.env` 配置环境文件中修改对应的 prometheus 服务 ip/host
  7. 下载镜像 docker-compose pull
  8. 启动镜像 docker-compose up -d
  9. 在浏览器上打开 localhost:7003 使用 Nebula Dashboard。