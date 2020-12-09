# Start
## Start nebula-stats-exporter in console
docker run --restart=always -p 9100:9100 -v {你的绝对路径}/nebula-dashboard/vendors/nebula-stat-exporter/config:/config megabyte875/nebula-stats-exporter:v0.0.2 --bare-metal --bare-metal-config-path=/config/config.yml

## Start Prometheus in console
docker run --name=prometheus --restart=always -p 9090:9090 -v /Users/niania/WorkSpace/nebula-dashboard/vendors/nebula-stat-exporter/config:/etc/prometheus/ prom/prometheus

## Summary
We start these services to help us develop dashboard locally，so make better use of them.