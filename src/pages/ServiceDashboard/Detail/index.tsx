import { Empty, Popover, Select, Spin } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, useHistory, useLocation, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Chart } from '@antv/g2';
import {
  getDataByType,
  getProperTickInterval,
  calcTimeRange,
  getBaseLineByUnit,
  getMaxNum,
  getMetricsUniqName,
  getMachineRouterPath,
  AggregationType,
  getMinNum,
  getTickIntervalByGap,
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';
import { asyncBatchQueries } from '@/requests';
import { BatchQueryItem, IServiceMetricItem, MetricScene, ServiceMetricsPanelValue, ServiceName } from '@/utils/interface';
import LineChart from '@/components/Charts/LineChart';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';

import ServiceMetricsFilterPanel from '@/components/ServiceMetricsFilterPanel';
import { getQueryRangeInfo, shouldCheckCluster } from '@/utils';

import { ClusterServiceNameMap, DEPENDENCY_PROCESS_TYPES, getQueryByMetricType, isLatencyMetric } from '@/utils/metric';
import { getClusterPrefix } from '@/utils/promQL';

import styles from './index.module.less';

interface MetricChartItem {
  metric: IServiceMetricItem;
  index: number, baseLine: any;
  chartRef?: any;
  visible: boolean;
}

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
  updateMetricsFiltervalues: dispatch.service.updateMetricsFiltervalues,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  serviceMetric: state.serviceMetric,
  cluster: (state as any)?.cluster?.cluster,
  metricsFilterValues: (state as any).service.metricsFilterValues as ServiceMetricsPanelValue,
  instanceList: (state as any).service.instanceList,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState>,
  RouteComponentProps { }

function ServiceDetail(props: IProps) {
  const { serviceMetric, cluster, updateMetricsFiltervalues, metricsFilterValues, instanceList, asyncGetSpaces, aliasConfig } = props;

  const location = useLocation();

  const [serviceType, setServiceType] = useState<string>('');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [isDependencyService, setIsDependencyService] = useState<boolean>(false);

  const pollingTimerRef = useRef<any>(null);

  const history = useHistory();
  useEffect(() => {
    const { serviceType } = metricsFilterValues
    serviceType && setServiceType(serviceType);
  }, [metricsFilterValues.serviceType])

  useEffect(() => {
    const [start, end] = calcTimeRange(metricsFilterValues.timeRange);
    if (shouldCheckCluster()) {
      if (cluster?.id) {
        asyncGetSpaces({
          clusterID: cluster.id,
          start,
          end
        })
      }
    } else {
      asyncGetSpaces({
        start,
        end
      })
    }
  }, [metricsFilterValues.timeRange, cluster])

  const metricOptions = useMemo<IServiceMetricItem[]>(() => {
    if (serviceMetric.graphd.length === 0
      || serviceMetric.storaged.length === 0
      || serviceMetric.metad.length === 0
    ) {
      return [];
    }
    let options: IServiceMetricItem[] = [];
    if (serviceType) {
      options = serviceMetric[serviceType];
    }
    return options;
  }, [serviceType, serviceMetric.graphd, serviceMetric.metad, serviceMetric.storaged, serviceMetric.drainerd, serviceMetric['metad-listener'], serviceMetric['storaged-listener']]);

  const metricNameList: string[] = useMemo(() => (
    (metricOptions || []).map((metric) => metric.metric)
  ), [metricOptions]);

  const [metricCharts, setMetricCharts] = useState<MetricChartItem[]>([]);

  useEffect(() => {
    const match = /(\w+)-metrics/g.exec(location.pathname);
    let serviceType = '';
    if (match) {
      setIsDependencyService(match[1] === 'dependency');
      serviceType = match[1] === 'dependency' ? metricsFilterValues.serviceType : match[1] || 'graphd';
    }
    setServiceType(serviceType);
  }, [location]);

  useEffect(() => {
    clearPolling();
    if (shouldCheckCluster()) {
      if (cluster?.id) {
        pollingData();
      }
    } else {
      pollingData();
    }
  }, [metricsFilterValues.timeRange, metricsFilterValues.frequency,
  metricsFilterValues.metricType, metricsFilterValues.period, metricsFilterValues.space, cluster, metricCharts]);

  useEffect(() => () => {
    clearPolling();
  }, [])

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  useEffect(() => {
    setMetricCharts(metricOptions.map((metric, index) => ({ metric, index, baseLine: null, visible: true })));
  }, [metricOptions])

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
      pollingData();
    }
  }, [metricCharts])

  const asyncGetMetricsData = async (showLoading: boolean = false, updateMetricCharts: MetricChartItem[] = metricCharts) => {
    if (updateMetricCharts.length === 0 || !cluster?.id) return;
    showLoading && setShowLoading(true);
    const finMetricCharts = updateMetricCharts.filter(chart => chart.visible);
    const { timeRange, period = "5", space, } = metricsFilterValues;
    const [startTime, endTime] = calcTimeRange(timeRange);
    const { start, end, step } = getQueryRangeInfo(startTime, endTime);
    const queries: BatchQueryItem[] = finMetricCharts.map((chart: MetricChartItem) => {
      const metricItem: IServiceMetricItem = chart.metric;
      const aggregation = metricItem.aggregations[0] as AggregationType;
      let query = getQueryByMetricType(metricItem, aggregation, period);
      const clusterSuffix1 = cluster ? `${getClusterPrefix()}="${cluster.id}"` : '';
      const spaceSuffix = serviceType === ServiceName.GRAPHD && space !== undefined ? `,space="${space}"` : '';
      if (aggregation === AggregationType.Sum && !metricItem.isRawMetric) {
        query = `sum_over_time(${query}{${clusterSuffix1}${spaceSuffix}}[${15}s])`;
      } else {
        if (query.includes('cpu_seconds_total')) {
          query = `avg by (instanceName) (rate(${query}{${clusterSuffix1}}[5m])) * 100`
        } else {
          query = `${query}{${clusterSuffix1}${spaceSuffix}}`;
        }
      }
      return {
        refId: metricItem.metric,
        query: query,
        start,
        end,
        step
      }
    });
    const data: any = await asyncBatchQueries(queries);
    const { results } = data;
    if (!results) {
      return;
    };
    finMetricCharts.forEach((chart: MetricChartItem) => {
      const datasource = results[chart.metric.metric].result;
      updateChart(chart, datasource);
    });
    showLoading && setShowLoading(false);
  };


  const pollingData = async () => {
    asyncGetMetricsData(true);
    if (metricsFilterValues.frequency > 0) {
      pollingTimerRef.current = setInterval(asyncGetMetricsData, metricsFilterValues.frequency);
    }
  };

  const updateChart = (metricChart: MetricChartItem, dataSource: any) => {
    const { instanceList } = metricsFilterValues;
    const data = getDataByType({
      data: dataSource || [],
      type: instanceList,
      nameObj: getMetricsUniqName(MetricScene.SERVICE),
      aliasConfig,
    });
    const realRange = data.length > 0 ? (data[data.length - 1].time - data[0].time) : 0;
    const tickInterval = getTickIntervalByGap(Math.floor(realRange / 10)); // 10 ticks max
    metricChart.chartRef.updateDetailChart({
      type: serviceType,
      valueType: metricChart.metric.valueType,
      tickInterval,
      maxNum: getMaxNum(data),
      minNum: getMinNum(data),
    }).changeData(data);
  };

  const renderChart = (i: number) => () => {
    const chart = metricCharts[i];
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    chart.chartRef.configDetailChart({
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: chart.metric.valueType,
    });
    if (chart.visible && chart.baseLine) {
      chart.chartRef.updateBaseline(chart.baseLine);
    }
  };

  const handleBaseLineEdit = (metricChart) => () => {
    BaseLineEditModal.show({
      baseLine: metricChart.baseLine,
      valueType: metricChart.metric.valueType,
      onOk: (values) => handleBaseLineChange(metricChart, values),
    })
  };

  const handleBaseLineChange = async (metricChart, values) => {
    const { baseLine, unit } = values;
    metricChart.baseLine = getBaseLineByUnit({
      baseLine,
      unit,
      valueType: metricChart.valueType,
    });
    metricChart.chartRef.updateBaseline(metricChart.baseLine);
  };

  const handleMetricChange = async values => {
    updateMetricsFiltervalues(values);
    if (values.serviceType) {
      setServiceType(values.serviceType);
    }
  };

  const handleRefresh = () => {
    asyncGetMetricsData(true);
  }

  const handleMetricsChange = (values) => {
    if (values.length === 0) {
      metricCharts.forEach(chart => {
        chart.visible = true;
      })
    } else {
      metricCharts.forEach(chart => {
        chart.visible = values.includes(chart.metric.metric);
      })
    }
    setMetricCharts([...metricCharts]);
  }

  const getViewPath = (path: string): string => {
    if (cluster?.id) {
      return getMachineRouterPath(path, cluster.id);
    }
    return path;
  }

  const handleViewDetail = (metricItem) => () => {
    history.push(getViewPath(`/metrics-detail/${serviceType}/${metricItem.metric.metric}`));
  }

  const getDependencyTypes = () => {
    if (!cluster?.id) return [];
    return DEPENDENCY_PROCESS_TYPES.filter(serviceType => {
      return cluster[ClusterServiceNameMap[serviceType]].length > 0;
    });
  }

  useEffect(() => {
    if (isDependencyService) {
      const dependencies = getDependencyTypes();
      updateMetricsFiltervalues({
        serviceType: dependencies[0],
      });
    }
  }, [cluster, isDependencyService])

  const handleMetricAggChange = (metricChart: MetricChartItem) => (value: string) => {
    const [metric, agg] = value.split('$$');
    metricChart.metric = {
      ...metricChart.metric,
      metric,
      aggregations: [agg as AggregationType],
    }
    asyncGetMetricsData(true, [metricChart]);
  }

  const renderChartTitle = (metricItem: IServiceMetricItem, metricChart: MetricChartItem) => {
    if (isLatencyMetric(metricItem.metric)) {
      const metrics = [AggregationType.Avg, AggregationType.P99, AggregationType.P95].map(agg => ({
        ...metricItem,
        metric: `${metricItem.metric}$$${agg}`,
        aggregations: [agg]
      }))
      return (
        <div className={styles.chartTitle}>
          <Select
            bordered={false}
            value={metricItem.metric + '$$' + metricItem.aggregations[0]}
            onChange={handleMetricAggChange(metricChart)}
          >
            {
              metrics.map(metric => (
                <Select.Option key={metric.metric} value={metric.metric}>
                  <div className={styles.chartTitleOption}>
                    <span title={metric.metric.replaceAll('$$', '_')} style={{ fontWeight: 'bold' }}>{metric.metric.replaceAll('$$', '_')}</span>
                    <Popover
                      className={styles.chartTitlePopover}
                      content={
                        <div>{intl.get(`metric_description.${metricItem.metric}`)}</div>
                      }
                    >
                      <Icon className={`${styles.blue} ${styles.chartTitleDesc}`} icon="#iconnav-serverInfo" />
                    </Popover>
                  </div>
                </Select.Option>
              ))
            }
          </Select>
        </div>
      )
    }
    return (
      <div className={styles.chartTitle}>
        <span title={metricItem.metric}>{metricItem.metric}</span>
        <Popover
          className={styles.chartTitlePopover}
          content={
            <div>{intl.get(`metric_description.${metricItem.metric}`)}</div>
          }
        >
          <Icon className={`${styles.blue} ${styles.chartTitleDesc}`} icon="#iconnav-serverInfo" />
        </Popover>
      </div>
    )
  }

  return (
    <Spin spinning={showLoading} wrapperClassName={styles.serviceDetail}>
      <div className={styles.dashboardDetail}>
        <div className={styles.filter}>
          <ServiceMetricsFilterPanel
            onChange={handleMetricChange}
            instanceList={instanceList}
            spaces={serviceType === ServiceName.GRAPHD ? serviceMetric.spaces : undefined}
            values={metricsFilterValues}
            onRefresh={handleRefresh}
            metrics={metricNameList}
            onMetricsChange={handleMetricsChange}
            serviceTypes={isDependencyService ? getDependencyTypes() : undefined}
          />
        </div>
        <div className={styles.detailContent}>
          {
            metricCharts.length ? (
              metricCharts.map((metricChart, i) => (
                <div key={i} className={styles.chartItem} style={{ display: metricChart.visible ? 'flex' : 'none' }}>
                  {
                    renderChartTitle(metricChart.metric, metricChart)
                  }
                  <div className={styles.chartContent}>
                    <LineChart
                      ref={ref => metricChart.chartRef = ref}
                      renderChart={renderChart(i)}
                    />
                  </div>
                  <div className={styles.actionIcons}>
                    <div
                      className={`${styles.btnIconWithDesc} ${styles.blue} ${styles.viewDetail}`}
                      onClick={handleViewDetail(metricChart)}
                    >
                      <Icon icon="#iconwatch" />
                    </div>
                    <div
                      className={`${styles.btnIconWithDesc} ${styles.blue}`}
                      onClick={handleBaseLineEdit(metricChart)}
                    >
                      <Icon icon="#iconSet_up" />
                      <span>{intl.get('common.baseLine')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noDataContent}>
                <Empty description={intl.get('service.noServiceInstalled')} />
              </div>
            )
          }
        </div>
      </div>
    </Spin>
  );
}
export default connect(mapState, mapDispatch)(withRouter(ServiceDetail));
