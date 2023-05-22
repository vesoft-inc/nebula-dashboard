/**
 * EXPLAIN: beacuse the metrics in each system are different, so dashboard need to load the detailed promql used by system
 */
import intl from 'react-intl-universal';

export enum VALUE_TYPE {
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
      metric: 'cpu_io_wait_used',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'cpu_user_used',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'cpu_system_used',
      valueType: VALUE_TYPE.percentage,
    },
  ],
  memory: [
    {
      metric: 'memory_used_utilization',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_cached_utilization',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_swap_utilization',
      valueType: VALUE_TYPE.percentage,
    },
    {
      metric: 'memory_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_cached',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_swap_used',
      valueType: VALUE_TYPE.byte,
    },
    {
      metric: 'memory_swap_total',
      valueType: VALUE_TYPE.byte,
    },
  ],
  load: [
    {
      metric: 'load_1',
      valueType: VALUE_TYPE.number,
    },
    {
      metric: 'load_5',
      valueType: VALUE_TYPE.number,
    },
    {
      metric: 'load_15',
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

export const diskPararms = 'mountpoint !~".*pod.*"';

const getPromqlLabel = (cluster?, device?: string, instance?: string) => {
  const clusterSuffix = cluster ? `${getClusterPrefix()} = "${cluster}"` : '';
  const devicePararmSuffix = device ? `device=~"${device}"` : '';
  const instanceSuffix = instance ? `instance=~"^${instance.replaceAll(".", "\.")}.*"` : '';
  const promqlLabel = [clusterSuffix, devicePararmSuffix, instanceSuffix].reduce((x, y) => {
    if (x.length > 0 && y.length > 0) {
      return `${x},${y}`;
    }
    return x + y;
  });
  return promqlLabel;
}

export let LINUX = (cluster?, device?: string, instance?: string): any => {
  const suffix = getPromqlLabel(cluster, device, instance);
  const suffix1 = suffix.length ? `,${suffix}` : '';
  const suffix2 = suffix.length ? `{${suffix}}` : '';
  return {
    // cpu relative:
    cpu_utilization: `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"${suffix1}}[1m])) * 100)`,
    cpu_idle: `avg by (instance) (irate(node_cpu_seconds_total{mode="idle"${suffix1}}[1m])) * 100`,
    cpu_io_wait_used: `avg by (instance) (irate(node_cpu_seconds_total{mode="iowait"${suffix1}}[1m])) * 100`,
    cpu_user_used: `avg by (instance) (irate(node_cpu_seconds_total{mode="user"${suffix1}}[1m])) * 100`,
    cpu_system_used: `avg by (instance) (irate(node_cpu_seconds_total{mode="system"${suffix1}}[1m])) * 100`,

    // memory relative:
    memory_used_utilization: `((node_memory_MemTotal_bytes${suffix2} - node_memory_MemAvailable_bytes${suffix2}) / node_memory_MemTotal_bytes${suffix2} )* 100`,
    memory_avaliable_utilization: `(node_memory_MemAvailable_bytes${suffix2}  / node_memory_MemTotal_bytes${suffix2} )* 100`,
    memory_cached_utilization: `(node_memory_Buffers_bytes${suffix2} + node_memory_Cached_bytes${suffix2}) / node_memory_MemTotal_bytes${suffix2} * 100`,
    memory_swap_utilization: `(node_memory_SwapTotal_bytes${suffix2} - node_memory_SwapFree_bytes${suffix2}) / node_memory_MemTotal_bytes${suffix2} * 100`,

    memory_total: `node_memory_MemTotal_bytes${suffix2}`,
    memory_used: `node_memory_MemTotal_bytes${suffix2} - node_memory_MemAvailable_bytes${suffix2}`,
    memory_avaliable: `node_memory_MemAvailable_bytes${suffix2}`,
    memory_cached: `node_memory_Buffers_bytes${suffix2} + node_memory_Cached_bytes${suffix2}`,
    memory_swap_used: `node_memory_SwapTotal_bytes${suffix2} - node_memory_SwapFree_bytes${suffix2}`,
    memory_swap_total: `node_memory_SwapTotal_bytes${suffix2}`,

    // node load relative:
    load_1: `node_load1${suffix2}`,
    load_5: `node_load5${suffix2}`,
    load_15: `node_load15${suffix2}`,

    // disk relative:
    disk_used: `sum(node_filesystem_size_bytes${suffix2} - node_filesystem_free_bytes${suffix2}) by (device,instance)`,
    disk_free: `sum(node_filesystem_avail_bytes${suffix2}) by (device,instance)`,
    disk_readbytes: `irate(node_disk_read_bytes_total${suffix2}[1m])`,
    disk_writebytes: `irate(node_disk_written_bytes_total${suffix2}[1m])`,
    disk_readiops: `irate(node_disk_reads_completed_total${suffix2}[1m])`,
    disk_writeiops: `irate(node_disk_writes_completed_total${suffix2}[1m])`,
    inode_utilization: `(1- (node_filesystem_files_free${suffix2}) / (node_filesystem_files{mountpoint="/",fstype!="rootfs"${suffix1}})) * 100`,
    disk_used_percentage: `(node_filesystem_size_bytes${suffix2}-node_filesystem_free_bytes${suffix2}) *100/(node_filesystem_avail_bytes${suffix2}+(node_filesystem_size_bytes${suffix2}-node_filesystem_free_bytes${suffix2}))`,
    disk_size: `node_filesystem_size_bytes${suffix2}`,
    root_fs_used_percentage: `100 - ((node_filesystem_avail_bytes{fstype!="rootfs"${suffix1}} * 100) / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"${suffix1}})`,

    network_in_rate: `ceil(sum by(instance)(irate(node_network_receive_bytes_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,
    network_out_rate: `ceil(sum by(instance)(irate(node_network_transmit_bytes_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,
    network_in_errs: `ceil(sum by(instance)(irate(node_network_receive_errs_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,
    network_out_errs: `ceil(sum by(instance)(irate(node_network_transmit_errs_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,
    network_in_packets: `ceil(sum by(instance)(irate(node_network_receive_packets_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,
    network_out_packets: `ceil(sum by(instance)(irate(node_network_transmit_packets_total{device=~"(eth|en)[a-z0-9]*"${suffix1}}[1m])))`,

    open_file_desc: `node_filefd_allocated${suffix2}`,
    context_switch_rate: `irate(node_context_switches_total${suffix2}[30s])`
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
      query: `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"${clusterSuffix1}}[1m])) * 100)`,
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
      query: `max(irate(node_disk_read_bytes_total${clusterSuffix2}[30s])) by (instance)`
    },
    {
      refId: "diskMaxWrite",
      query: `max(irate(node_disk_written_bytes_total${clusterSuffix2}[30s])) by (instance)`
    },
    {
      refId: "networkIn",
      query: `max(irate(node_network_receive_bytes_total${clusterSuffix2}[30s])*8) by (instance)`
    },
    {
      refId: "networkOut",
      query: `max(irate(node_network_transmit_bytes_total${clusterSuffix2}[30s])*8) by (instance)`
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
  const encodedInstance = instance.replaceAll('.', '_');
  return {
    cpu: {
      title: intl.get('device.cpu'),
      valueType: VALUE_TYPE.percentage,
      viewPath: `/machine-metric/cpu/${encodedInstance}`,
      queries: [
        {
          refId: 'cpu_total_used',
          query: `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"${clusterSuffix1},${instanceSuffix}}[1m])) * 100)`,
        },
        {
          refId: 'cpu_system_used',
          query: `avg by (instance) (irate(node_cpu_seconds_total{mode="system"${clusterSuffix1},${instanceSuffix}}[1m])) * 100`,
        },
        {
          refId: 'cpu_user_used',
          query: `avg by (instance) (irate(node_cpu_seconds_total{mode="user"${clusterSuffix1},${instanceSuffix}}[1m])) * 100`,
        },
        {
          refId: 'cpu_io_wait_used',
          query: `avg by (instance) (irate(node_cpu_seconds_total{mode="iowait"${clusterSuffix1},${instanceSuffix}}[1m])) * 100`,
        }
      ]
    },
    memory_utilization: {
      title: intl.get('device.memoryPercentage'),
      valueType: VALUE_TYPE.percentage,
      viewPath: `/machine-metric/memory_utilization/${encodedInstance}`,
      queries: [
        {
          refId: 'memory_currnet_used_utilization',
          query: `(node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}} - node_memory_MemAvailable_bytes{${instanceSuffix}${clusterSuffix1}}) / (node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}) * 100`,
        },
        {
          refId: 'memory_avaliable_utilization',
          query: `node_memory_MemAvailable_bytes{${instanceSuffix}${clusterSuffix1}} / (node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}) * 100`,
        },
        {
          refId: 'memory_cached_utilization',
          query: `(node_memory_Buffers_bytes{${instanceSuffix}${clusterSuffix1}} + node_memory_Cached_bytes{${instanceSuffix}${clusterSuffix1}}) / (node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}) * 100`,
        },
        {
          refId: 'memory_swap_utilization',
          query: `(node_memory_SwapTotal_bytes{${instanceSuffix}${clusterSuffix1}} - node_memory_SwapFree_bytes{${instanceSuffix}${clusterSuffix1}}) / (node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}) * 100`,
        },
      ]
    },
    memory: {
      title: intl.get('device.memory'),
      valueType: VALUE_TYPE.byte,
      viewPath: `/machine-metric/memory/${encodedInstance}`,
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
      viewPath: `/machine-metric/load/${encodedInstance}`,
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
      viewPath: `/machine-metric/diskIO/${encodedInstance}`,
      queries: [
        {
          refId: 'disk_read_rate',
          query: `irate(node_disk_reads_completed_total{${instanceSuffix}${clusterSuffix1}}[1m])`,
        },
        {
          refId: 'disk_write_rate',
          query: `irate(node_disk_writes_completed_total{${instanceSuffix}${clusterSuffix1}}[1m])`,
        },
      ]
    },
    diskIONum: {
      title: intl.get('device.diskIONum'),
      valueType: VALUE_TYPE.byteSecondNet,
      viewPath: `/machine-metric/diskIONum/${encodedInstance}`,
      queries: [
        {
          refId: 'disk_read_rate',
          query: `irate(node_disk_read_bytes_total{${instanceSuffix}${clusterSuffix1}}[1m])`,
        },
        {
          refId: 'disk_write_rate',
          query: `irate(node_disk_written_bytes_total{${instanceSuffix}${clusterSuffix1}}[1m])`,
        },
      ]
    },
    network: {
      title: intl.get('device.network'),
      valueType: VALUE_TYPE.byteSecondNet,
      viewPath: `/machine-metric/network/${encodedInstance}`,
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
      viewPath: `/machine-metric/openFileDesc/${encodedInstance}`,
      queries: [
        {
          refId: 'open_file_desc',
          query: `node_filefd_allocated{${instanceSuffix}${clusterSuffix1}}`,
        },
        {
          refId: 'context_switch_rate',
          query: `irate(node_context_switches_total{${instanceSuffix}${clusterSuffix1}}[30s])`,
        }
      ]
    }
  }
}