import { AggregationType } from './dashboard';
import { ServiceName } from './interface';

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
  [ServiceName.GRAPHD]: [
    {
      period: 60,
      metric: 'num_queries',
      aggregation: AggregationType.Rate,
    },
    {
      period: 60,
      metric: 'num_slow_queries',
      aggregation: AggregationType.Rate,
    },
  ],
  [ServiceName.STORAGED]: [
    {
      period: 60,
      metric: 'add_edges_latency_us',
      aggregation: AggregationType.Avg,
    },
    {
      period: 60,
      metric: 'add_vertices_latency_us',
      aggregation: AggregationType.Avg,
    }
  ],
  [ServiceName.METAD]: [
    {
      period: 60,
      metric: 'heartbeat_latency_us',
      aggregation: AggregationType.Avg,
    },
    {
      period: 60,
      metric: 'num_heartbeats',
      aggregation: AggregationType.Rate,
    }
  ],
  [ServiceName.MetadListener]: [],
  [ServiceName.StoragedListener]: [],
  [ServiceName.Drainer]: []
};
