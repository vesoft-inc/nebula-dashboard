/**
 * EXPLAIN: beacuse the metrics in each system are different, so dashboard need to load the detailed promql used by system
 */

export const MAC_OS = {
  CPU_USAGE_RATE: '100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  MEMORY_USAGE_RATE: '(1 - avg_over_time(node_memory_free_bytes[1m]) / avg_over_time(node_memory_total_bytes[1m]) )* 100',
  MEMORY_SIZE: 'node_memory_total_bytes',
  DISK_USAGE_RATE: '(1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} ) /  node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})* 100',
  DISK_SIZE: 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}',
  NETWORK_FLOW_DOWN: 'sum by(instance)(rate(node_network_receive_bytes_total{device=~"en[0-9]*"}[1m]))',
  NETWORK_FLOW_UP: 'sum by(instance)(rate(node_network_transmit_bytes_total{device=~"en[0-9]*"}[1m]))',
};

export const LINUX = {
  CPU_USAGE_RATE: '100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  MEMORY_USAGE_RATE: '(1 - avg_over_time(node_memory_MemFree_bytes[1m]) / avg_over_time(node_memory_MemTotal_bytes[1m]) )* 100',
  MEMORY_SIZE: 'node_memory_MemTotal_bytes',
  DISK_USAGE_RATE: '(1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} ) /  node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})* 100',
  DISK_SIZE: 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}',
  NETWORK_FLOW_DOWN: 'sum by(instance)(rate(node_network_receive_bytes_total{device=~"eth[0-9]*"}[1m]))',
  NETWORK_FLOW_UP: 'sum by(instance)(rate(node_network_transmit_bytes_total{device=~"eth[0-9]*"}[1m]))',
};