import { Popover, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, useHistory, useLocation, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import {
  getDataByType,
  getProperTickInterval,
  calcTimeRange,
  getBaseLineByUnit,
  getMaxNum,
  getMetricsUniqName,
  getMachineRouterPath,
  AggregationType,
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';
import { IMetricOption, IServiceMetricItem, MetricScene, ServiceMetricsPanelValue } from '@/utils/interface';

import LineChart from '@/components/Charts/LineChart';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';

import ServiceMetricsFilterPanel from '@/components/ServiceMetricsFilterPanel';
import { shouldCheckCluster } from '@/utils';

import './index.less';
import { getQueryByMetricType } from '@/utils/metric';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
  asyncFetchMetricsData: dispatch.service.asyncGetMetricsData,
  asyncUpdateBaseLine: (key, value) =>
    dispatch.machine.update({
      [key]: value,
    }),
  updateMetricsFiltervalues: dispatch.service.updateMetricsFiltervalues,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  serviceMetric: state.serviceMetric,
  cluster: (state as any)?.cluster?.cluster,
  metricsFilterValues: (state as any).service.metricsFilterValues as ServiceMetricsPanelValue,
  instanceList: (state as any).service.instanceList,
  loading: state.loading.models.service,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState>,
  RouteComponentProps { }

let pollingTimer: any;

function ServiceDetail(props: IProps) {
  const { asyncFetchMetricsData, serviceMetric, loading, cluster, updateMetricsFiltervalues, metricsFilterValues, instanceList, asyncGetSpaces } = props;

  const location = useLocation();

  const [serviceType, setServiceType] = useState<string>('');
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    setShowLoading(loading && metricsFilterValues.frequency === 0)
  }, [loading, metricsFilterValues.frequency]);

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
      || serviceMetric.metad.length === 0) {
      return [];
    }
    let options: IServiceMetricItem[] = [];
    if (serviceType) {
      options = serviceMetric[`${serviceType}d`];
    }
    return options;
  }, [serviceType, serviceMetric.graphd, serviceMetric.metad, serviceMetric.storaged]);

  const metricTypeMap: Map<AggregationType, IServiceMetricItem[]> = useMemo(() => {
    const map: Map<AggregationType, IServiceMetricItem[]> = {} as any;
    metricOptions.forEach(option => {
      option.aggregations.forEach(type => {
        // const { key, value } = type;
        // const metricItem: IServiceMetricItem = {
        //   metric: option.metric,
        //   isSpaceMetric: option.isSpaceMetric,
        //   metricType: option.metricType,
        //   valueType: option.valueType,
        //   isRawMetric: option.isRawMetric,
        //   metricFunction: value,
        // };
        if (!map[type]) {
          map[type] = [option];
        } else {
          map[type].push(option)
        }
      })
    })
    return map;
  }, [metricOptions]);

  const metricNameList: string[] = useMemo(() => (
    (metricOptions || []).map((metric) => metric.metric)
  ), [metricOptions]);

  const [curMetricOptions, setMetricOptions] = useState<IServiceMetricItem[]>(metricOptions);

  useEffect(() => {
    const match = /(\w+)-metrics/g.exec(location.pathname);
    let serviceType = '';
    if (match) {
      serviceType = match[1] || 'graph';
    }
    setServiceType(serviceType);
  }, [location]);

  const metricCharts: any = useMemo(() => {
    if (Object.keys(metricTypeMap).length === 0) return [];
    const { metricType } = metricsFilterValues;
    let charts: any = [];
    if (metricType === 'all') {
      charts = metricOptions.map((metric, i) => ({
        metric,
        chartInstance: undefined,
        index: i,
        baseLine: undefined,
      }))
    } else {
      charts = metricTypeMap[metricType].map((metric, i) => ({
        metric,
        chartInstance: undefined,
        index: i,
        baseLine: undefined,
      }));
    }
    return charts;
  }, [metricTypeMap, metricsFilterValues.metricType])

  useEffect(() => {
    if (pollingTimer) {
      clearPolling();
    }
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
    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }
  };

  useEffect(() => {
    setMetricOptions(metricOptions)
  }, [metricOptions])

  useEffect(() => {
    if (dataSources.length === 0) return;
    updateChart();
  }, [metricsFilterValues.instanceList, dataSources])

  const asyncGetMetricsData = async () => {
    const { timeRange, period, space, metricType } = metricsFilterValues;
    const [startTime, endTime] = calcTimeRange(timeRange);
    const getPromise = (chart) => {
      return new Promise((resolve, reject) => {
        const item: IServiceMetricItem = metricTypeMap[metricType].find(metricItem => metricItem.metric === chart.metric.metric);
        asyncFetchMetricsData({
          query: getQueryByMetricType(item, metricType, period),
          start: startTime,
          end: endTime,
          space: serviceType === 'graph' ? space : undefined,
          clusterID: cluster?.id,
        }).then(res => {
          resolve(res);
        }).catch(e => {
          reject(e)
        });
      })
    }
    Promise.all(metricCharts.map(chart => getPromise(chart))).then((dataSources) => {
      setDataSources(dataSources)
    })
  };

  const pollingData = async () => {
    asyncGetMetricsData();
    if (metricsFilterValues.frequency > 0) {
      pollingTimer = setTimeout(pollingData, metricsFilterValues.frequency);
    }
  };

  const updateChart = () => {
    const { aliasConfig } = props;
    const { instanceList } = metricsFilterValues;
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts.forEach((chart, i) => {
      if (chart.chartInstance) {
        const data = getDataByType({
          data: dataSources[i] || [],
          type: instanceList,
          nameObj: getMetricsUniqName(MetricScene.SERVICE),
          aliasConfig,
        });
        chart.maxNum = getMaxNum(data);
        updateDetailChart(chart.chartInstance, {
          type: serviceType,
          tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
        }).changeData(data);
        chart.chartInstance.autoFit = true;
      }
    })
  };

  const renderChart = (i: number) => (chartInstance: Chart) => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts[i].chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: metricCharts[i].metric.valueType,
    });
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
  };

  const handleRefresh = () => {
    setShowLoading(!!loading);
    asyncGetMetricsData();
  }

  const handleMetricsChange = (values) => {
    if (values.length === 0) {
      setMetricOptions(metricOptions);
    } else {
      setMetricOptions(metricOptions.filter(metric => values.includes(metric.metric)));
    }
  }

  const shouldShow = (metricItem) => {
    return curMetricOptions.find(item => item.metric === metricItem.metric)
  }

  const getViewPath = (path: string): string => {
    if (cluster?.id) {
      return getMachineRouterPath(path, cluster.id);
    }
    return path;
  }

  const handleViewDetail = (metricItem) => () => {
    history.push(getViewPath(`/metrics-detail/${serviceType}d/${metricItem.metric.metric}`));
  }

  return (
    <Spin spinning={showLoading} wrapperClassName="service-detail">
      <div className='dashboard-detail'>
        <div className='filter'>
          <ServiceMetricsFilterPanel
            onChange={handleMetricChange}
            instanceList={instanceList}
            spaces={serviceType === 'graph' ? serviceMetric.spaces : undefined}
            values={metricsFilterValues}
            onRefresh={handleRefresh}
            metrics={metricNameList}
            onMetricsChange={handleMetricsChange}
          />
        </div>
        <div className='detail-content'>
          {
            metricCharts.map((metricChart, i) => (
              <div key={i} className='chart-item' style={{ display: shouldShow(metricChart.metric) ? 'flex' : 'none' }}>
                <div className='chart-title'>
                  {metricChart.metric.metric}
                  <Popover
                    className={"chart-title-popover"}
                    content={
                      <div>{intl.get(`metric_description.${metricChart.metric.metric}`)}</div>
                    }
                  >
                    <Icon className="metric-info-icon blue chart-title-desc" icon="#iconnav-serverInfo" />
                  </Popover>
                </div>
                <div className='chart-content'>
                  <LineChart
                    isDefaultScale={
                      metricChart.valueType === VALUE_TYPE.percentage
                    }
                    yAxisMaximum={metricChart.maxNum}
                    baseLine={metricChart.baseLine}
                    options={{ padding: [20, 20, 60, 50] }}
                    ref={ref => metricChart.chartRef = ref}
                    renderChart={renderChart(i)}
                  />
                </div>
                <div className="action-icons">
                  <div
                    className="btn-icon-with-desc blue view-detail"
                    onClick={handleViewDetail(metricChart)}
                  >
                    <Icon icon="#iconwatch" />
                  </div>
                  <div
                    className="btn-icon-with-desc blue base-line"
                    onClick={handleBaseLineEdit(metricChart)}
                  >
                    <Icon icon="#iconSetup" />
                    <span>{intl.get('common.baseLine')}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Spin>
  );
}
export default connect(mapState, mapDispatch)(withRouter(ServiceDetail));
