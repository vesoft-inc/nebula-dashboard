gi# Start
## Start nebula-stats-exporter in console
docker run -p 9100:9100 -v {你的绝对路径}/nebula-dashboard/vendors/nebula-stats-exporter/config:/config megabyte875/nebula-stats-exporter:v0.0.2 --bare-metal --bare-metal-config-path=/config/config.yml

## Start Prometheus in console
docker run --name=prometheus -p 8080:8080 -v /Users/niania/WorkSpace/nebula-dashboard/vendors/nebula-stats-exporter/config:/etc/prometheus/ prom/prometheus

## Start granfana
docker run -p 3000:3000 grafana/grafana

## Summary
We start these services to help us develop dashboard locally，so make better use of them.