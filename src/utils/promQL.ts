/**
 * EXPLAIN: beacuse the metrics in each system are different, so dashboard need to load the detailed promql used by system
 */
import intl from 'react-intl-universal';

export const enum VALUE_TYPE {
  percentage = 'PERCENTAGE',
  byte = 'BYTE',
  byteSecond = 'BYTE_SECOND',
  byteSecondNet = 'BYTE_SECOND_NET',
  diskIONet = 'DISK_IO_NET',
  number = 'NUMBER',
  numberSecond = 'numberSecond',
  status = 'status',
  latency = 'latency'
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
    // {
    //   metric: 'memory_utilization',
    //   valueType: VALUE_TYPE.percentage,
    // },
    {
      metric: 'memory_used_percentage',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_actual_used_percentage',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_actual_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_free',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_swap_total',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_cached_buffer_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_cached_buffer_used_percentage',
      valueType: VALUE_TYPE.percentage,
    },
  ],
  load: [
    {
      metric: 'load_15s',
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
    {
      metric: 'root_fs_used_percentage',
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

export const getClusterPrefix = () => {
  return 'nebula_cluster';
}

export const diskPararms = 'fstype=~"ext.*|xfs",mountpoint !~".*pod.*"';

export let LINUX = (cluster?, device?: string): any => {
  const clusterSuffix1 = cluster ? `,${getClusterPrefix()}='${cluster}'` : '';
  const clusterSuffix2 = cluster ? `{${getClusterPrefix()}='${cluster}'}` : '';
  const devicePararms = device ? `,device=~"${device}"` : '';


  return {
    // cpu relative:
    cpu_utilization: `100 * (1 - sum by (instance)(increase(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_idle: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_wait: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="iowait"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_user: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="user"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,
    cpu_system: `100 * (sum by (instance)(increase(node_cpu_seconds_total{mode="system"${clusterSuffix1}}[1m])) / sum by (instance)(increase(node_cpu_seconds_total${clusterSuffix2}[1m])))`,

    // memory relative:
    // memory_utilization: `(1 - node_memory_MemFree_bytes${clusterSuffix2} / node_memory_MemTotal_bytes${clusterSuffix2} )* 100`,
    memory_used_percentage: `((node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2}) / node_memory_MemTotal_bytes${clusterSuffix2} )* 100`,
    memory_used: `node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2}`,
    memory_actual_used: `node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2} - node_memory_Buffers_bytes${clusterSuffix2} - node_memory_Cached_bytes${clusterSuffix2}`,
    memory_actual_used_percentage: `((node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemFree_bytes${clusterSuffix2} - node_memory_Buffers_bytes${clusterSuffix2} - node_memory_Cached_bytes${clusterSuffix2}) / node_memory_MemTotal_bytes${clusterSuffix2} )* 100`,
    memory_free: `node_memory_MemFree_bytes${clusterSuffix2}`,
    memory_cached_buffer_used: `node_memory_Buffers_bytes${clusterSuffix2} + node_memory_Cached_bytes${clusterSuffix2}`,
    memory_cached_buffer_used_percentage: `((node_memory_Buffers_bytes${clusterSuffix2} + node_memory_Cached_bytes${clusterSuffix2}) / node_memory_MemTotal_bytes${clusterSuffix2} )* 100`,
    memory_size: `node_memory_MemTotal_bytes${clusterSuffix2}`,
    memory_swap_total: `node_memory_SwapTotal_bytes${clusterSuffix2}`,

    // node load relative:
    load_15s: `node_load1${clusterSuffix2}`,
    load_5m: `node_load5${clusterSuffix2}`,
    load_15m: `node_load15${clusterSuffix2}`,

    // disk relative:
    disk_used: `node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}} - node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,
    disk_free: `node_filesystem_avail_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,
    disk_readbytes: `irate(node_disk_read_bytes_total{${devicePararms ? devicePararms : 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_writebytes: `irate(node_disk_written_bytes_total{${devicePararms ? devicePararms : 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_readiops: `irate(node_disk_reads_completed_total{${devicePararms ? devicePararms : 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    disk_writeiops: `irate(node_disk_writes_completed_total{${devicePararms ? devicePararms : 'device=~"(sd|nvme|hd)[a-z0-9]*"'}${clusterSuffix1}}[1m])`,
    inode_utilization: `(1- (node_filesystem_files_free{${diskPararms}${devicePararms}${clusterSuffix1}}) / (node_filesystem_files{mountpoint="/",fstype!="rootfs"${clusterSuffix1}})) * 100`,
    disk_used_percentage: `(node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}-node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}) *100/(node_filesystem_avail_bytes {${diskPararms}${devicePararms}${clusterSuffix1}}+(node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}-node_filesystem_free_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}))`,
    disk_size: `node_filesystem_size_bytes{${diskPararms}${devicePararms}${clusterSuffix1}}`,
    root_fs_used_percentage: `100 - ((node_filesystem_avail_bytes{fstype!="rootfs"${clusterSuffix1}} * 100) / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"${clusterSuffix1}})`,

    network_in_rate: `ceil(sum by(instance)(irate(node_network_receive_bytes_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_rate: `ceil(sum by(instance)(irate(node_network_transmit_bytes_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_in_errs: `ceil(sum by(instance)(irate(node_network_receive_errs_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_errs: `ceil(sum by(instance)(irate(node_network_transmit_errs_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_in_packets: `ceil(sum by(instance)(irate(node_network_receive_packets_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
    network_out_packets: `ceil(sum by(instance)(irate(node_network_transmit_packets_total{device=~"(eth|en)[a-z0-9]*"${clusterSuffix1}}[1m])))`,
  }
};

export let getNodeInfoQueries = (clusterId?) => {
  const clusterSuffix1 = clusterId ? `,${getClusterPrefix()}='${clusterId}'` : '';
  const clusterSuffix2 = clusterId ? `{${getClusterPrefix()}='${clusterId}'}` : '';
  return ([
    {
      refId: "nodeName",
      query: `node_uname_info${clusterSuffix2}-0`
    },
    {
      refId: "cpuUtilization",
      query: `(1 - avg(rate(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[30s])) by (instance)) * 100`,
    },
    {
      refId: "memoryUtilization",
      query: `(1 - (node_memory_MemAvailable_bytes${clusterSuffix2} /(node_memory_MemTotal_bytes${clusterSuffix2})))* 100`,
    },
    {
      refId: "runtime",
      query: `sum(time() - node_boot_time_seconds${clusterSuffix2})by(instance) / 3600 / 24`
    },
    {
      refId: "cpuCore",
      query: `count(node_cpu_seconds_total{mode='system'${clusterSuffix1}}) by (instance)`
    },
    {
      refId: "memory",
      query: `node_memory_MemTotal_bytes${clusterSuffix2} - 0`
    },
    {
      refId: "diskUtilization",
      query: `max((node_filesystem_size_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}}-node_filesystem_free_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}}) *100/(node_filesystem_avail_bytes {fstype=~\"ext.?|xfs\"${clusterSuffix1}}+(node_filesystem_size_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}}-node_filesystem_free_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}})))by(instance)`
    },
    {
      refId: "disk",
      query: `sum(node_filesystem_size_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}})by(instance)`
    },
    {
      refId: "diskUsed",
      query: `sum(node_filesystem_size_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}}-node_filesystem_free_bytes{fstype=~\"ext.?|xfs\"${clusterSuffix1}})by(instance)`
    },
    {
      refId: "load5s",
      query: `node_load5${clusterSuffix2} - 0`
    },
    {
      refId: "diskMaxRead",
      query: `max(rate(node_disk_read_bytes_total${clusterSuffix2}[30s])) by (instance)`
    },
    {
      refId: "diskMaxWrite",
      query: `max(rate(node_disk_written_bytes_total${clusterSuffix2}[30s])) by (instance)`
    },
    {
      refId: "networkIn",
      query: `max(rate(node_network_receive_bytes_total${clusterSuffix2}[30s])*8) by (instance)`
    },
    {
      refId: "networkOut",
      query: `max(rate(node_network_transmit_bytes_total${clusterSuffix2}[30s])*8) by (instance)`
    },
    {
      refId: "memoryUsed",
      query: `node_memory_MemTotal_bytes${clusterSuffix2} - node_memory_MemAvailable_bytes${clusterSuffix2} `,
    }
  ])
}

export const updatePromql = (service: {
  SUPPORT_METRICS: typeof SUPPORT_METRICS,
  LINUX: typeof LINUX,
}) => {
  SUPPORT_METRICS = service.SUPPORT_METRICS
  LINUX = service.LINUX
}

export const getMachineMetricData = (instance, cluster) => {
  const clusterSuffix1 = cluster ? `,${getClusterPrefix()}="${cluster.id}"` : '';
  const instanceSuffix = `instance=~"^${instance.replaceAll(".", "\.")}.*"`;
  return {
    cpu: {
      title: intl.get('device.cpu'),
      valueType: VALUE_TYPE.percentage,
      viewPath: "/machine/cpu",
      queries: [
        {
          refId: 'cpu_total_used',
          query: `(1 - avg(irate(node_cpu_seconds_total{mode="idle"${clusterSuffix1},${instanceSuffix}}[30s])) by (instance))*100`,
        },
        {
          refId: 'cpu_system_used',
          query: `avg(irate(node_cpu_seconds_total{mode="system"${clusterSuffix1},${instanceSuffix}}[30s])) by (instance) *100`,
        },
        {
          refId: 'cpu_user_used',
          query: `avg(irate(node_cpu_seconds_total{mode="user"${clusterSuffix1},${instanceSuffix}}[30s])) by (instance) *100`,
        },
        {
          refId: 'cpu_io_wait_used',
          query: `avg(irate(node_cpu_seconds_total{mode="iowait"${clusterSuffix1},${instanceSuffix}}[30s])) by (instance) *100`,
        }
      ]
    },
    memory: {
      title: intl.get('device.memory'),
      valueType: VALUE_TYPE.byte,
      viewPath: "/machine/memory",
      queries: [
        {
          refId: 'memory_total',
          query: `node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'memory_currnet_used',
          query: `node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}} - node_memory_MemAvailable_bytes{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'memory_avaliable',
          query: `node_memory_MemAvailable_bytes{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'memory_cached',
          query: `node_memory_Buffers_bytes{${instanceSuffix}${clusterSuffix1}} + node_memory_Cached_bytes{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'memory_swap_used',
          query: `node_memory_SwapTotal_bytes{${instanceSuffix}${clusterSuffix1}} - node_memory_SwapFree_bytes{${instanceSuffix}${clusterSuffix1}}`,
        },
      ]
    },
    load: {
      title: intl.get('device.load'),
      valuetype: VALUE_TYPE.number,
      viewPath: "/machine/load",
      queries: [
        {
          refId: 'cpu_load_1',
          query: `node_load1{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'cpu_load_5',
          query: `node_load5{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'cpu_load_15',
          query: `node_load15{${instanceSuffix}${clusterSuffix1}}`,
        },
      ]
    },
    diskIO: {
      title: intl.get('device.diskIO'),
      valueType: VALUE_TYPE.diskIONet,
      viewPath: "/machine/disk",
      queries: [
        {
          refId: 'disk_read_rate',
          query: `rate(node_disk_reads_completed_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        },
        {
          refId: 'disk_write_rate',
          query: `rate(node_disk_writes_completed_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        },
      ]
    },
    diskIONum: {
      title: intl.get('device.diskIONum'),
      valueType: VALUE_TYPE.byteSecondNet,
      viewPath: "/machine/disk",
      queries: [
        {
          refId: 'disk_read_rate',
          query: `rate(node_disk_read_bytes_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        },
        {
          refId: 'disk_write_rate',
          query: `rate(node_disk_written_bytes_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        },
      ]
    },
    network: {
      title: intl.get('device.network'),
      valueType: VALUE_TYPE.byteSecondNet,
      viewPath: "/machine/network",
      queries: [
        {
          refId: 'network_in',
          query: `ceil(sum by(instance)(irate(node_network_receive_bytes_total{device=~"(eth|en)[a-z0-9]*",${instanceSuffix}${clusterSuffix1}}[30s])))`,
        },
        {
          refId: 'network_out',
          query: `ceil(sum by(instance)(irate(node_network_transmit_bytes_total{device=~"(eth|en)[a-z0-9]*",${instanceSuffix}${clusterSuffix1}}[30s])))`,
        },
      ]
    },
    openFileDesc: {
      title: intl.get('device.openfiledesc'),
      valueType: VALUE_TYPE.number,
      queries: [
        {
          refId: 'open_file_desc',
          query: `node_filefd_allocated{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'context_switch_rate',
          query: `rate(node_context_switches_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        }
      ]
    }
  }
}