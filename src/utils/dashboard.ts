import dayjs from 'dayjs';
import _ from 'lodash';
import semver from 'semver';
import cookies from 'js-cookie';

import { ILineChartMetric, IStatRangeItem, MetricScene } from '@/utils/interface';
import { VALUE_TYPE } from '@/utils/promQL';

export const DETAIL_DEFAULT_RANGE = 60 * 60 * 24 * 1000;
export const MAX_STEP_ALLOW = 11000;
export const TIME_INTERVAL_OPTIONS = [5, 60, 600, 3600];
export enum AggregationType {
  Sum = 'sum',
  Rate = 'rate',
  Avg = 'avg',
  P75 = 'p75',
  P95 = 'p95',
  P99 = 'p99',
  P999 = 'p999',
}
export const AGGREGATION_OPTIONS = Object.values(AggregationType);

export const THRESHOLDS = {
  low: 60,
  medium: 90,
};

export const CARD_LOW_COLORS = 'rgba(61,209,136,1)';
export const CARD_MEDIUM_COLORS = 'rgba(245,182,13,1)';
export const CARD_HIGH_COLORS = 'rgba(230,113,113,1)';

export const getProperStep = (start: number, end: number) => {
  const hours = Math.round((end - start) / (3600 * 1000));
  if (hours <= 1) {
    return 5;//15s
  }
  if (hours <= 6) {
    return 30;
  }
  if (hours <= 12) {
    return 60;
  }
  if (hours <= 72) {
    return 300;
  }
  return 600;
};
export const getTickIntervalByGap = (gap: number) => {
  if (gap <= 10*60) {// 15min
    return 10*60;
  }
  if (gap <= 30*60) {//30min
    return 30*60;
  }
  if (gap <= 60*60*6) {//<3hour
    return 60*60*2;
  }
  if (gap <= 10 * 60 * 60) {//6hour
    return 60*60*6;
  }
  if (gap <= 24 * 60 * 60) {//10hour
    return 60*60*24;
  }
  return gap - gap%60*60*24;
}

export const renderUnit = type => {
  switch (type) {
    case VALUE_TYPE.byteSecond:
    case VALUE_TYPE.byteSecondNet:
      return ['Bytes/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    case VALUE_TYPE.byte:
      return ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    case VALUE_TYPE.numberSecond:
      return ['/s'];
    case VALUE_TYPE.percentage:
      return ['%'];
    default:
      return [];
  }
};
export const VERSION_REGEX = /\d+\.{1}\d+\.{1}\d+/;

export const getBaseLineByUnit = (config: {
  baseLine: number;
  unit: string;
  valueType: string;
}) => {
  const { baseLine, unit, valueType } = config;
  let conversion = 1024;
  if (valueType === VALUE_TYPE.byteSecondNet) {
    conversion = 1000;
  }
  switch (unit) {
    case 'KB':
    case 'KB/s':
      return conversion * baseLine;
    case 'MB':
    case 'MB/s':
      return conversion * conversion * baseLine;
    case 'GB':
    case 'GB/s':
      return conversion * conversion * conversion * baseLine;
    case 'TB':
    case 'TB/s':
      return conversion * conversion * conversion * conversion * baseLine;
    default:
      return baseLine;
  }
};

export const getWhichColor = value => {
  if (value < THRESHOLDS.low) {
    return CARD_LOW_COLORS;
  }
  if (value < THRESHOLDS.medium) {
    return CARD_MEDIUM_COLORS;
  }
  return CARD_HIGH_COLORS;
};

export const getProperByteDesc = (bytes: number) => {
  const sign = Math.sign(bytes);

  bytes = Math.abs(bytes);

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;

  if (bytes === 0) return {
    value: 0, 
    unit: '',
    desc: '0',
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = sign * parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  const unit = sizes[i];

  return {
    value, 
    unit,
    desc: value + unit,
  }
}

export const getProperByUnit = (bytes: number, unit: string) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;
  const i = sizes.findIndex(s => s === unit);
  const value = (bytes / Math.pow(1024, i)).toFixed(2)
  return {
    value:parseFloat(value),
    unit,
    desc: value + unit,
  }
}

export const getAutoLatency = (latency: number) => {
  if (latency > 60 * 1000 * 1000) {
    // min
    return `${(latency / 60 / 1000 / 1000).toFixed(2)}min`;
  }
  if (latency > 1000 * 1000) {
    // s
    return `${(latency / 1000 / 1000).toFixed(2)}s`;
  }
  if (latency > 1000) {
    // ms
    return `${(latency / 1000).toFixed(2)}ms`;
  }
  return `${latency}μs`;
};
export const getDataByType = (payload: {
  data: IStatRangeItem[];
  type?: string | string[];
  nameObj: {
    name: string;
    showName: (name: string) => string;
  };
  aliasConfig?: any;
  instanceList?: string[];
}) => {
  const { nameObj, data, aliasConfig, instanceList } = payload;
  let { type } = payload;
  const { name, showName } = nameObj;
  const res = [] as ILineChartMetric[];
  data.forEach(instance => {
    instance.values.forEach(([timstamps, value]) => {
      const _name = instance.metric[name];
      let shouldPush = false;
      if (typeof type === 'string') {
        shouldPush = (type === 'all' && _name !== 'total') || _name === type;
      } else if (Array.isArray(type)) {
        if (type.includes('all')) {
          shouldPush= instanceList ? instanceList.some(instance => _name.includes(instance)) : true;
        } else {
          shouldPush = !!type.find(t => _name.includes(t))
        }
      }
      if (shouldPush) {
        res.push({
          type: showName(aliasConfig && aliasConfig[_name] ? aliasConfig[_name] : _name),
          value: Number(value),
          time: timstamps,
        });
      }
    });
  });
  return res;
};

export let getDiskData = (payload: {
  data: IStatRangeItem[];
  type?: string | string[];
  aliasConfig?: any;
  nameObj: {
    name: string;
    showName: (name: string) => string;
  };
  instanceList?: string[];
}) => {
  const { type, data, nameObj, instanceList } = payload;
  const { name, showName } = nameObj;
  const res = [] as ILineChartMetric[];
  data.forEach(instance => {
    instance.values.forEach(([timstamps, value]) => {
      const device = instance.metric['device'];
      const _name = instance.metric[name];
      let shouldPush = false;
      if (typeof type === 'string') {
        shouldPush = (type === 'all' && _name !== 'total') || _name === type;
      } else if (Array.isArray(type)) {
        if (type.includes('all')) {
          shouldPush= instanceList ? instanceList.some(instance => _name.includes(instance)) : true;
        } else {
          shouldPush = !!type.find(t => _name.includes(t))
        }
      }
      if (shouldPush) {
        res.push({
          type: `${showName(_name)}-${device}`,
          value: Number(value),
          time: timstamps,
        });
      }
    });
  });
  return res;
}

export const getProperTickInterval = period => {
  period/=1000;
  switch (period) {
    // past one hour
    case 24 * 60 * 60:
      return 2 * 60 * 60;
    case 60 * 60:
      return 5 * 60;
    default:
      return period < 60 * 60 ? 30 : 60 * 60 * 2;
  }
};

export enum TIME_OPTION_TYPE {
  MIN5 = '5min',
  HOUR1 = '1hour',
  HOUR6 = '6hour',
  HOUR12 = '12hour',
  DAY1 = '1day',
  DAY3 = '3day',
  DAY7 = '7day',
  DAY14 = '14day',
  DAY30 = '30day',
}

export const TIME_OPTION_MAP = {
  MIN5: {
    name: TIME_OPTION_TYPE.MIN5,
    value: 5 * 60 * 1000,
  },
  HOUR1: {
    name: TIME_OPTION_TYPE.HOUR1,
    value: 60 * 60 * 1000,
  },
  HOUR6: {
    name: TIME_OPTION_TYPE.HOUR6,
    value: 60 * 60 * 6 * 1000,
  },
  HOUR12: {
    name: TIME_OPTION_TYPE.HOUR12,
    value: 60 * 60 * 12 * 1000,
  },
  DAY1: {
    name: TIME_OPTION_TYPE.DAY1,
    value: 60 * 60 * 24 * 1000,
  },
  DAY3: {
    name: TIME_OPTION_TYPE.DAY3,
    value: 60 * 60 * 24 * 3 * 1000,
  },
  DAY7: {
    name: TIME_OPTION_TYPE.DAY7,
    value: 60 * 60 * 24 * 7 * 1000,
  },
  DAY14: {
    name: TIME_OPTION_TYPE.DAY14,
    value: 60 * 60 * 24 * 14 * 1000,
  },
  DAY30: {
    name: TIME_OPTION_TYPE.DAY30,
    value: 60 * 60 * 24 * 30 * 1000,
  },
}

export const MetricTIMEOPTIONS = [
  TIME_OPTION_MAP.MIN5,
  TIME_OPTION_MAP.HOUR1,
  TIME_OPTION_MAP.HOUR6,
  TIME_OPTION_MAP.HOUR12,
  TIME_OPTION_MAP.DAY1,
  TIME_OPTION_MAP.DAY3,
  // TIME_OPTION_MAP.DAY7,
  // TIME_OPTION_MAP.DAY14,
];

export const OtherTIMEOPTIONS = [
  TIME_OPTION_MAP.HOUR1,
  TIME_OPTION_MAP.HOUR6,
  TIME_OPTION_MAP.HOUR12,
  TIME_OPTION_MAP.DAY1,
  TIME_OPTION_MAP.DAY3,
  TIME_OPTION_MAP.DAY7,
  TIME_OPTION_MAP.DAY14,
];

export let NEED_ADD_SUM_QUERYS = [
  // For Instanc
  'memory_used',
  // 'memory_actual_used',
  'memory_free',
  'disk_used',
  'disk_free',
  'disk_readbytes',
  'disk_writebytes',
  'disk_readiops',
  'disk_writeiops',
  'network_in_errs',
  'network_out_errs',
  'network_in_packets',
  'network_out_packet',
  // For NebulaGraph Service
  'num_queries',
  'num_slow_queries',
];

export const calcTimeRange = (timeRange: TIME_OPTION_TYPE | [number, number]): [number, number] => {
  const end = Date.now();
  if (typeof timeRange === 'string') {
    const value = MetricTIMEOPTIONS.concat(OtherTIMEOPTIONS).find(t => t.name === timeRange)?.value!;
    return [end - value, end];
  } else if (typeof timeRange === 'object' && timeRange.length === 2) {
    return timeRange;
  }
  throw new Error('timeRange is not valid');
}

export enum MACHINE_TYPE {
  cpu = 'cpu',
  memory = 'memory',
  load = 'load',
  disk = 'disk',
  networkOut = 'networkOut',
  networkIn = 'networkIn',
  network = 'network',
}

export const VERSIONS = ['v2.0.1', 'v2.5.1', 'v2.6.1', 'v3.0.0', 'v3.1.0', 'v3.2.0'];

export const getDefaultTimeRange = (interval?: number) => {
  const end = Date.now();
  const start = interval ? end - interval : end - DETAIL_DEFAULT_RANGE;
  return [dayjs(start), dayjs(end)];
};

export const getMaxNum = data => {
  const max = _.maxBy(data, item => item.value) as any;
  return max ? max.value : 0;
};

export const getMinNum = data => {
  const min = _.minBy(data, item => item.value) as any;
  return min ? min.value : 0;
};

export const getMaxNumAndLength = (payload: {
  data: any[];
  valueType: string;
  baseLine?: number;
}) => {
  const { data = [], valueType, baseLine } = payload;
  const maxNum = getMaxNum(data);
  let maxString =  maxNum === 0 && baseLine
      ? baseLine.toString()
      : maxNum.toString();
  let maxNumLen = maxString.length;
  switch (valueType) {
    case VALUE_TYPE.percentage:
      maxNumLen = 5;
      break;
    case VALUE_TYPE.byte:
    case VALUE_TYPE.byteSecond: {
      const { value, unit } = getProperByteDesc(maxNum);
      if (valueType === VALUE_TYPE.byteSecond) {
        maxNumLen = unit.length + value.toString().length + 2;
      }
      maxNumLen = (unit?.length || 0) + (value?.toString()?.length || 0);
      break;
    }
    case VALUE_TYPE.byteSecondNet:
    case VALUE_TYPE.diskIONet:
    {
      const { value, unit } = getProperByteDesc(maxNum);
      maxNumLen = unit.length + value.toString().length + 2;
      break;
    }
    case VALUE_TYPE.number:
    case VALUE_TYPE.numberSecond:
      maxNumLen = maxString.split('.')[0].length ;
      break;
    default:
      break;
  }
  return { maxNum, maxNumLen };
};

export function compareVersion(v1, v2) {
  // if not version format, return -1;
  if (!v1.match(VERSION_REGEX) || !v2.match(VERSION_REGEX)) {
    return -1;
  }
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10);
    const num2 = parseInt(v2[i], 10);

    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export const UNKONW_VERSION = 'unknow';

// 0.0.1 means unknow version
export function getVersion(v: string) {
  const match = v?.match(VERSION_REGEX);
  return match ? match[0] : v;
}

export let getMetricsUniqName = (scene: MetricScene) => {
  if (scene === MetricScene.SERVICE) {
    return {
      name: 'instanceName',
      showName: (name) => name
    }
  }
  return {
    name: 'instance',
    showName: (name) => name
  }
}

export const getConfigData = (data) => {
  let list = [] as any;
  data.split('\n')?.forEach(item => {
    const [name, value] = item.split('=')
    if (name) {
      list.push({ name, value })
    }
  })
  return list;
}

export const getDefaultNebulaVersion = () => {
  return (window as any).NIGHTLY_NEBULA_VERSION || process.env.NEBULA_VERSION!;
}

export function formatVersion(version?: string): string {
  if (!version) {
    version = cookies.get('version');
  }
  if (semver.valid(version)) {
    return semver.clean(version!)!;
  }
  return getDefaultNebulaVersion();
}

export let getMachineRouterPath = (path: string, id?): string => `/clusters/${id}${path}`;

export const updateService = (service: {
  getMetricsUniqName: typeof getMetricsUniqName,
  getMachineRouterPath: typeof getMachineRouterPath,
  getDiskData: typeof getDiskData,
  NEED_ADD_SUM_QUERYS: typeof NEED_ADD_SUM_QUERYS,
}) => {
  getMetricsUniqName = service.getMetricsUniqName;
  getMachineRouterPath = service.getMachineRouterPath;
  getDiskData = service.getDiskData;
  NEED_ADD_SUM_QUERYS = service.NEED_ADD_SUM_QUERYS;
}

