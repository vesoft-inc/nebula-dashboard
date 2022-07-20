import { SERVICE_SUPPORT_METRICS } from '@/utils/promQL';

export const SERVICE_POLLING_INTERVAL = 10 * 1000;
export const SERVICE_QUERY_PERIOD = 10 * 60;
export const SERVICE_DEFAULT_RANGE = 6 * 60 * 60 * 1000;

export enum INTERVAL_FREQUENCY_TYPE {
  OFF = 'Off',
  S5 = '5s',
  S10 = '10s',
  S15 = '15s',
  S30 = '30s',
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  M30 = '30m',
}

export const INTERVAL_FREQUENCY_LIST = [
  {
    type: INTERVAL_FREQUENCY_TYPE.OFF,
    value: 0,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S5,
    value: 5 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S10,
    value: 10 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S15,
    value: 15 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S30,
    value: 30 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M1,
    value: 60 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M5,
    value: 5 * 60 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M15,
    value: 15 * 60 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M30,
    value: 30 * 60 * 1000,
  }
]

export const LINE_COLORS = [
  '#4372FF',
  '#EB2F96',
  '#0EBAD2',
  '#29C377',
  '#F5B60D',
  '#E25F5F',
  '#7B9CFF',
  '#55CFDE',
  '#F16DB5',
  '#67D39E',
  '#F6CA54',
  '#EB8E8E',
  '#B4C6FF',
  '#9CE3EB',
  '#F7ACD5',
  '#A6E4C5',
  '#F8DE9B',
  '#F4BCBC',
  '#BFBFBF',
  '#595959',
];

export const DEFAULT_SERVICE_PANEL_CONFIG = {
  graph: [
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.graph[0].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.graph[0].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.graph[0].metricType[0].key,
    },
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.graph[1].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.graph[1].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.graph[1].metricType[0].key,
    },
  ],
  storage: [
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.storage[0].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.storage[0].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.storage[0].metricType[0].key,
    },
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.storage[1].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.storage[1].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.storage[1].metricType[0].key,
    },
  ],
  meta: [
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.meta[0].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.meta[0].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.meta[0].metricType[0].key,
    },
    {
      period: 60,
      metric: SERVICE_SUPPORT_METRICS.meta[1].metric,
      metricFunction: SERVICE_SUPPORT_METRICS.meta[1].metricType[0].value,
      metricType: SERVICE_SUPPORT_METRICS.meta[1].metricType[0].key,
    },
  ],
};
