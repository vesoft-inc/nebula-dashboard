export interface IMetric {
  instance: string,
  instanceName: string,
  device?: string
}
export interface IStatRangeItem {
  metric: IMetric,
  values: [number, any]
}
export interface IStatSingleItem {
  metric: IMetric,
  value: [number, any]
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

export interface IServicePanelConfig {
  period: number,
  metric: string,
  metricFunction: string,
  metricType: string,
  baseLine: number| undefined,
}