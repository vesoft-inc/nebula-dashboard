import { AggregationType, TIME_OPTION_TYPE } from "./dashboard";
import { VALUE_TYPE } from "./promQL";

export interface IMetric {
  instance: string;
  instanceName: string;
  device?: string;
  mountpoint?: string;
}
export interface IStatRangeItem {
  metric: IMetric;
  values: [number, any];
}
export interface IStatSingleItem {
  metric: IMetric;
  value: [number, any];
}

export interface IVersionItem {
  name: string;
  version: string;
}

export interface ILineChartMetric {
  time: number;
  value: number;
  type: string;
}

export interface IServicePanelConfig {
  period: number;
  metric: string;
  aggregation: AggregationType;
  space?: string;
  // metricType: string;
  baseLine?: number;
}

export interface IMetricType {
  key: string;
  value: string;
}

export interface IMetricOption {
  metric: string;
  isSpaceMetric: boolean;
  metricType: IMetricType[];
  valueType: VALUE_TYPE;
}

export interface MetricsPanelValue {
  timeRange: TIME_OPTION_TYPE | [number, number];
  instanceList: string[];
  frequency: number;
}

export interface ServiceMetricsPanelValue extends MetricsPanelValue {
  space: string;
  metricType: AggregationType | 'all';
  period: string;
  serviceType: ServiceName;
}

export interface DiskMetricInfo {
  size: number;
  device: string;
  used: number;
  mountpoint: string;
  name: string;
}

export enum DashboardType {
  COMMUNTY = 'community',
  ENTERPRISE = 'enterprise',
  CLOUD = 'cloud',
  PLAYGROUND = 'playground'
}

export enum MetricScene {
  MACHINE,
  SERVICE,
  CPU,
  NETWORK,
  DISK,
  MEMORY,
  LOAD,
}

export interface IMachineMetricOption {
  metric: string;
  valueType: VALUE_TYPE;
}

export interface IServiceMetricItem {
  metric: string;
  valueType: VALUE_TYPE;
  isSpaceMetric: boolean;
  isRawMetric: boolean;
  aggregations: string[];
  prefixMetric: string;
  metricFunction?: string;
}

export enum NebulaVersionType {
  COMMUNITY = 'community',
  ENTERPRISE = 'enterprise',
}

interface VersionFeatureItem {
  [propName: string]: boolean;
}

export interface VersionFeatureInfo {
  version: string;
  type: NebulaVersionType;
  feature: VersionFeatureItem;
}

export interface NebulaConnectInfo {
  address: string;
  port: number;
  clusterID: number;
}

export enum ServiceName {
  GRAPHD = 'graphd',
  METAD = 'metad',
  STORAGED = 'storaged',
  MetadListener = 'metad-listener',
  StoragedListener = 'storaged-listener',
  Drainer = 'drainerd',
}

export interface IPanelConfig {
  [ServiceName.GRAPHD]: IServicePanelConfig[];
  [ServiceName.STORAGED]: IServicePanelConfig[];
  [ServiceName.METAD]: IServicePanelConfig[];
  [ServiceName.MetadListener]: IServicePanelConfig[];
  [ServiceName.StoragedListener]: IServicePanelConfig[];
  [ServiceName.Drainer]: IServicePanelConfig[];
}
