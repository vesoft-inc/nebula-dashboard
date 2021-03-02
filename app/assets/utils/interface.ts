export interface IMetric {
  instance: string,
  instanceName: string,
}
export interface IStatRangeItem {
  metric: IMetric,
  values: [number, any]
}
export interface IStatSingleItem {
  metric: IMetric,
  value: [number, any]
}

interface IChartValue {
  time: number,
  value: number,
}

export interface IServiceItem {
  name: string,
  qps: number,
  qpsStatistics: IChartValue[],
  latency: string,
  error: string,
  version: string,
  status: string
}

export interface IQPSStatistics {
  normal: number,
  abnormal: number,
  overload: number,
  qps: number,
  qpsStatistics: IChartValue[],
}

export interface IServiceMetric {
  overview: IQPSStatistics,
  data: IServiceItem[]
}

export interface IVersionItem {
  name: string,
  version: string
}

export interface ILineChartMetric {
  time: number;
  value: number;
  type: string;
}