/**
 * EXPLAIN: beacuse the metrics in each system are different, so dashboard need to load the detailed promql used by system
 */

export const enum VALUE_TYPE {
  percentage = 'PERCENTAGE',
  byte = 'BYTE',
  byteSecond = 'BYTE_SECOND',
  byteSecondNet = 'BYTE_SECOND_ENT',
  number = 'NUMBER',
  numberSecond = 'numberSecond',
}

export let SUPPORT_METRICS =
  {
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
        valueType: VALUE_TYPE.percentage,
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
      },
    ],
    disk: [
      {
        metric: 'disk_used_percentage',
        valueType: VALUE_TYPE.percentage,
      },
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
      },
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
  graph: [
    {
      metric: 'num_queries',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_queries_rate_',
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_queries_sum_',
        },
      ],
    },
    {
      metric: 'num_slow_queries',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_slow_queries_rate_',
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_slow_queries_sum_',
        },
      ],
    },
    {
      metric: 'query_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_graphd_query_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_graphd_query_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_graphd_query_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_graphd_query_latency_us_p99_',
        },
        {
          key: 'p999',
          value: 'nebula_graphd_query_latency_us_p999_',
        },
      ],
    },
    {
      metric: 'slow_query_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_graphd_slow_query_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_graphd_slow_query_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_graphd_slow_query_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_graphd_slow_query_latency_us_p99_',
        },
        {
          key: 'p999',
          value: 'nebula_graphd_slow_query_latency_us_p999_',
        },
      ],
    },
    {
      metric: 'num_query_errors',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_graphd_num_query_errors_rate_',
        },
        {
          key: 'sum',
          value: 'nebula_graphd_num_query_errors_sum_',
        },
      ],
    },
  ],
  storage: [
    {
      metric: 'add_edges_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_add_edges_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_add_edges_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_add_edges_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_add_edges_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'add_vertices_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_add_vertices_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_add_vertices_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_add_vertices_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_add_vertices_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'delete_edges_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_delete_edges_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_delete_edges_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_delete_edges_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_delete_edges_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'delete_vertices_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_delete_vertices_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_delete_vertices_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_delete_vertices_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_delete_vertices_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'forward_tranx_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_forward_tranx_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_forward_tranx_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_forward_tranx_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_forward_tranx_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'get_neighbors_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_storaged_get_neighbors_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_storaged_get_neighbors_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_storaged_get_neighbors_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_storaged_get_neighbors_latency_us_p99_',
        },
      ],
    },
  ],
  meta: [
    {
      metric: 'heartbeat_latency_us',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'avg',
          value: 'nebula_metad_heartbeat_latency_us_avg_',
        },
        {
          key: 'p75',
          value: 'nebula_metad_heartbeat_latency_us_p75_',
        },
        {
          key: 'p95',
          value: 'nebula_metad_heartbeat_latency_us_p95_',
        },
        {
          key: 'p99',
          value: 'nebula_metad_heartbeat_latency_us_p99_',
        },
      ],
    },
    {
      metric: 'num_heartbeats',
      valueType: VALUE_TYPE.number,
      metricType: [
        {
          key: 'rate',
          value: 'nebula_metad_num_heartbeats_rate_',
        },
        {
          key: 'sum',
          value: 'nebula_metad_num_heartbeats_sum_',
        },
      ],
    },
  ],
};

export const getClusterPrefix = () => {
  return 'nebula_cluster';
}

export const diskPararms = 'fstype=~"ext.*|xfs",mountpoint !~".*pod.*"';

export let LINUX = (cluster?,device?:string) : any => {
  const clusterSuffix1 = cluster ? `,${getClusterPrefix()}='${cluster}'` : '';
  const clusterSuffix2 = cluster ? `{${getClusterPrefix()}='${cluster}'}` : '';
  const devicePararms = device? `,device=~"${device}"`: '';

  
  return {
    // cpu relative:
    cpu_utilization: `100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_idle: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_wait: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="iowait"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_user: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="user"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_system: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="system"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,

    // memory relative:
    memory_utilization: `(1 - (node_memory_MemFree_bytes${clusterSuffix2}+ node_memory_Buffers_bytes${clusterSuffix2}+ node_memory_Cached_bytes${clusterSuffix2}) / node_memory_MemTotal_bytes${clusterSuffix2} )* 100`,
    memory_used: `node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2}- node_memory_Buffers_bytes${clusterSuffix2}  - node_memory_Cached_bytes${clusterSuffix2}`,
    // memory_actual_used: `node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2} - node_memory_Buffers_bytes${clusterSuffix2} - node_memory_Cached_bytes${clusterSuffix2}`,
    memory_free: `node_memory_MemFree_bytes${clusterSuffix2}`,
    memory_size: `node_memory_MemTotal_bytes${clusterSuffix2}`,

    // node load relative:
    load_1m: `node_load1${clusterSuffix2}`,
    load_5m: `node_load5${clusterSuffix2}`,
    load_15m: `node_load15${clusterSuffix2}`,

    // disk relative:
    disk_used: `node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}} - node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,
    disk_free: `node_filesystem_avail_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,
    disk_readbytes: `irate(node_disk_read_bytes_total{${devicePararms? devicePararms: 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_writebytes: `irate(node_disk_written_bytes_total{${devicePararms? devicePararms: 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_readiops: `irate(node_disk_reads_completed_total{${devicePararms? devicePararms: 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_writeiops: `irate(node_disk_writes_completed_total{${devicePararms? devicePararms: 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    inode_utilization: `(1- (node_filesystem_files_free{${diskPararms}${devicePararms}${clusterSuffix1}}) / (node_filesystem_files{mountpoint="/",fstype!="rootfs"${clusterSuffix1}})) * 100`,
    disk_used_percentage: `(node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}-node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}) *100/(node_filesystem_avail_bytes {${diskPararms}${devicePararms}${clusterSuffix1}}+(node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}-node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}))`,
    disk_size: `node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,

    network_in_rate: `ceil(sum by(instance)(irate(node_network_receive_bytes_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_rate: `ceil(sum by(instance)(irate(node_network_transmit_bytes_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_in_errs: `ceil(sum by(instance)(irate(node_network_receive_errs_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_errs: `ceil(sum by(instance)(irate(node_network_transmit_errs_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_in_packets: `ceil(sum by(instance)(irate(node_network_receive_packets_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_packets: `ceil(sum by(instance)(irate(node_network_transmit_packets_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
  }
};

export const NEBULA_COUNT = {
  graph: 'nebula_graphd_count',
  storage: 'nebula_storaged_count',
  meta: 'nebula_metad_count',
};

export const updatePromql = (service: {
  SUPPORT_METRICS: typeof SUPPORT_METRICS,
  LINUX: typeof LINUX
}) => {
  SUPPORT_METRICS = service.SUPPORT_METRICS
  LINUX = service.LINUX
}

// export const serviceProcessPromql = (cluster?) => {
//   const clusterSuffix = cluster ? `${getClusterPrefix()}='${cluster}'` : '';
//   return {
//     // cpu_utilization
//     "cpu_used": `100 * sum by (nebula_cluster)(increase(nebula_graphd_cpu_seconds_total{${clusterSuffix}}[1m])) / sum by (nebula_cluster)(increase(node_cpu_seconds_total{${clusterSuffix}}[1m]))`,
//   }
// }