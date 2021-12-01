/**
 * EXPLAIN: beacuse the metrics in each system are different, so dashboard need to load the detailed promql used by system
 */

export enum VALUE_TYPE {
  percentage = 'PERCENTAGE',
  byte = 'BYTE',
  byteSecond = 'BYTE_SECOND',
  number = 'NUMBER',
  numberSecond = 'numberSecond'
}

export const SUPPORT_METRICS = {
  cpu: [
    {

      metric: 'cpu_utilization',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'cpu_idle',
      valueType: VALUE_TYPE.percentage,
    },
    {

      metric: 'cpu_wait',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'cpu_user',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'cpu_system',
      valueType: VALUE_TYPE.percentage
    },
  ],
  memory: [
    {
      metric: 'memory_utilization',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_actual_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_free',
      valueType: VALUE_TYPE.byte,
    },
  ],
  load: [
    {
      metric: 'load_1m',
      valueType: VALUE_TYPE.number,
    },
    {
      metric: 'load_5m',
      valueType: VALUE_TYPE.number,
    },
    {
      metric: 'load_15m',
      valueType: VALUE_TYPE.number,
    }
  ],
  disk: [
    {
      metric: 'disk_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'disk_free',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'disk_readbytes',
      valueType: VALUE_TYPE.byteSecond,
    },
    {
      metric: 'disk_writebytes',
      valueType: VALUE_TYPE.byteSecond,
    },
    {
      metric: 'disk_readiops',
      valueType: VALUE_TYPE.numberSecond,
    },
    {
      metric: 'disk_writeiops',
      valueType: VALUE_TYPE.numberSecond,
    },
    {
      metric: 'inode_utilization',
      valueType: VALUE_TYPE.percentage,
    }
  ],
  network: [
    {
      metric: 'network_in_rate',
      valueType: VALUE_TYPE.byteSecond,
    },
    {
      metric: 'network_out_rate',
      valueType: VALUE_TYPE.byteSecond,
    },
    {
      metric: 'network_in_errs',
      valueType: VALUE_TYPE.numberSecond,
    },
    {
      metric: 'network_out_errs',
      valueType: VALUE_TYPE.numberSecond,
    },
    {
      metric: 'network_in_packets',
      valueType: VALUE_TYPE.numberSecond,
    },
    {
      metric: 'network_out_packets',
      valueType: VALUE_TYPE.numberSecond,
    },
  ],
};

export const SERVICE_SUPPORT_METRICS = {
  graph:[
    {
      metric: 'num_queries',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_queries_rate_'
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_queries_sum_'
        }
      ],
    },
    {
      metric: 'num_slow_queries',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_slow_queries_rate_'
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_slow_queries_sum_'
        },
      ],
    },
    {
      metric: 'query_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_graphd_query_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_graphd_query_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_graphd_query_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_graphd_query_latency_us_p99_'
        },
        {
          key: 'p999',
          value: 'nebula_graphd_query_latency_us_p999_'
        },
      ],
    },
    {
      metric: 'slow_query_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_graphd_slow_query_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_graphd_slow_query_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_graphd_slow_query_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_graphd_slow_query_latency_us_p99_'
        },
        {
          key: 'p999',
          value: 'nebula_graphd_slow_query_latency_us_p999_'
        },
      ],
    },
    {
      metric: 'num_query_errors',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_query_errors_rate_'
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_query_errors_sum_'
        },
      ],
    },
  ],
  storage:[
    // Hack：atomic operaion is not guarateed in nebula now,thus it's will always return 0 unlesss user config it
    // {
    //   metric: 'add_edges_atomic_latency_us',
    //   valueType: VALUE_TYPE.number,
    //   metricType: [
    //     {
    //       key: 'avg',
    //       value: 'nebula_storaged_add_edges_atomic_latency_us_avg_'
    //     },
    //     {
    //       key: 'p75',
    //       value: 'nebula_storaged_add_edges_atomic_latency_us_p75_'
    //     },
    //     {
    //       key: 'p95',
    //       value: 'nebula_storaged_add_edges_atomic_latency_us_p95_'
    //     },
    //     {
    //       key: 'p99',
    //       value: 'nebula_storaged_add_edges_atomic_latency_us_p99_'
    //     },
    //   ],
    // },
    {
      metric: 'add_edges_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_add_edges_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_add_edges_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_add_edges_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_add_edges_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'add_vertices_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_add_vertices_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_add_vertices_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_add_vertices_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_add_vertices_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'delete_edges_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_delete_edges_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_delete_edges_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_delete_edges_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_delete_edges_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'delete_vertices_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_delete_vertices_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_delete_vertices_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_delete_vertices_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_delete_vertices_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'forward_tranx_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_forward_tranx_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_forward_tranx_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_forward_tranx_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_forward_tranx_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'get_neighbors_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_get_neighbors_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_storaged_get_neighbors_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_storaged_get_neighbors_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_storaged_get_neighbors_latency_us_p99_'
        },
      ]
    },
  ],
  meta:[
    {
      metric: 'heartbeat_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_metad_heartbeat_latency_us_avg_'
        },
        {
          key: 'p75',
          value: 'nebula_metad_heartbeat_latency_us_p75_'
        },
        {
          key: 'p95',
          value: 'nebula_metad_heartbeat_latency_us_p95_'
        },
        {
          key: 'p99',
          value: 'nebula_metad_heartbeat_latency_us_p99_'
        },
      ],
    },
    {
      metric: 'num_heartbeats',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_metad_num_heartbeats_rate_'
        },
        {
          key: 'sum',
          value: 'nebula_metad_num_heartbeats_sum_'
        }
      ]
    }
  ]
};

export const MAC_OS = {
  // cpu relative:
  cpu_utilization: '100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_idle: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_wait: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="iowait"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_user: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="user"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_system: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="system"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',

  // memory relative
  memory_util: '(1 - avg_over_time(node_memory_free_bytes[1m]) / avg_over_time(node_memory_total_bytes[1m]) )* 100',
  memory_size: 'node_memory_total_bytes',
  disk_usage_rate: '(1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} ) /  node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})* 100',
  disk_size: 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}',
  network_flow_down: 'sum by(instance)(rate(node_network_receive_bytes_total{device=~"en[0-9]*"}[1m]))',
  network_flow_up: 'sum by(instance)(rate(node_network_transmit_bytes_total{device=~"en[0-9]*"}[1m]))',
  node_load5: 'node_load5',
};

export const LINUX = {
  // cpu relative:
  cpu_utilization: '100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_idle: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_wait: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="iowait"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_user: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="user"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',
  cpu_system: '100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="system"}[5m])) / sum by (instance)(increase(node_cpu_seconds_total[5m])))',

  // memory relative:
  memory_utilization: '(1 - avg_over_time(node_memory_MemFree_bytes[1m]) / avg_over_time(node_memory_MemTotal_bytes[1m]) )* 100',
  memory_used: 'avg_over_time(node_memory_MemTotal_bytes[1m]) - avg_over_time(node_memory_MemFree_bytes[1m])',
  memory_actual_used: 'avg_over_time(node_memory_MemTotal_bytes[1m]) - avg_over_time(node_memory_MemAvailable_bytes[1m])',
  memory_free: 'avg_over_time(node_memory_MemFree_bytes[1m])',
  memory_size: 'node_memory_MemTotal_bytes',

  // node load relative:
  load_1m: 'node_load1',
  load_5m: 'node_load5',
  load_15m: 'node_load15',

  // disk relative:
  disk_used: 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"} - node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"}',
  disk_free: 'node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"}',
  disk_readbytes: 'irate(node_disk_read_bytes_total{device=~"(sd|nvme|hd)[a-z0-9]*"}[1m])',
  disk_writebytes: 'irate(node_disk_written_bytes_total{device=~"(sd|nvme|hd)[a-z0-9]*"}[1m])',
  disk_readiops: 'irate(node_disk_reads_completed_total{device=~"(sd|nvme|hd)[a-z0-9]*"}[1m])',
  disk_writeiops: 'irate(node_disk_writes_completed_total{device=~"(sd|nvme|hd)[a-z0-9]*"}[1m])',
  inode_utilization: '(1- (node_filesystem_files_free{mountpoint="/",fstype!="rootfs"}) / (node_filesystem_files{mountpoint="/",fstype!="rootfs"})) * 100',

  disk_size: 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}',
  network_in_rate: 'sum by(instance)(irate(node_network_receive_bytes_total{device=~"eth[0-9]*"}[1m]))',
  network_out_rate: 'sum by(instance)(irate(node_network_transmit_bytes_total{device=~"eth[0-9]*"}[1m]))',
  network_in_errs: 'sum by(instance)(irate(node_network_receive_errs_total{device=~"eth[0-9]*"}[1m]))',
  network_out_errs: 'sum by(instance)(irate(node_network_transmit_errs_total{device=~"eth[0-9]*"}[1m]))',
  network_in_packets: 'sum by(instance)(irate(node_network_receive_packets_total{device=~"eth[0-9]*"}[1m]))',
  network_out_packets: 'sum by(instance)(irate(node_network_transmit_packets_total{device=~"eth[0-9]*"}[1m]))',
};

export const NEBULA_COUNT = {
  graph: 'nebula_graphd_count',
  storage: 'nebula_storaged_count',
  meta: 'nebula_metad_count'
};