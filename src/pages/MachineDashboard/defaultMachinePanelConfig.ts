import { MachinePanelConfig } from '@/utils/interface';
import { VALUE_TYPE } from '@/utils/promQL';
import intl from 'react-intl-universal';

export default [
  {
    title: intl.get('device.cpu'),
    valueType: VALUE_TYPE.percentage,
    key: 'default_cpu',
    refIds: [
      'cpu_utilization',
      'cpu_system_used',
      'cpu_user_used',
      'cpu_io_wait_used',
    ]
  },
  {
    title: intl.get('device.memoryPercentage'),
    valueType: VALUE_TYPE.percentage,
    key: 'default_meory_utilization',
    refIds: [
      'memory_used_utilization',
      'memory_avaliable_utilization',
      'memory_cached_utilization',
      'memory_swap_utilization',
    ]
  },
  {
    title: intl.get('device.memory'),
    valueType: VALUE_TYPE.byte,
    key: 'default_memory',
    refIds: [
      'memory_total',
      'memory_used',
      'memory_avaliable',
      'memory_cached',
      'memory_swap_used',
      'memory_swap_total',
    ]
  },
  {
    title: intl.get('device.diskIO'),
    valueType: VALUE_TYPE.diskIONet,
    key: 'default_diskio',
    refIds: [
      'disk_readiops',
      'disk_writeiops'
    ]
  },
  {
    title: intl.get('device.diskIONum'),
    valueType: VALUE_TYPE.byteSecondNet,
    key: 'default_diskionum',
    refIds: [
      'disk_readbytes',
      'disk_writebytes',
    ]
  },
  {
    title: intl.get('device.network'),
    valueType: VALUE_TYPE.byteSecondNet,
    key: 'default_network',
    refIds: [
      'network_in_rate',
      'network_out_rate'
    ]
  },
  {
    title: intl.get('device.load'),
    valueType: VALUE_TYPE.number,
    key: 'default_load',
    refIds: [
      'load_1',
      'load_5',
      'load_15'
    ]
  },
  {
    title: intl.get('device.openfiledesc'),
    valueType: VALUE_TYPE.number,
    key: 'default_openfile',
    refIds: [
      'open_file_desc',
      'context_switch_rate',
    ]
  }
] as MachinePanelConfig[]