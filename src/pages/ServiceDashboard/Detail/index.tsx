import { Popover, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, useLocation, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import {
  getDataByType,
  getProperTickInterval,
  calcTimeRange,
  getBaseLineByUnit,
  getMaxNum,
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';
import { IMetricOption, ServiceMetricsPanelValue } from '@/utils/interface';

import LineChart from '@/components/Charts/LineChart';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';

import ServiceMetricsFilterPanel from '@/components/ServiceMetricsFilterPanel';
import { shouldCheckCluster } from '@/utils';

import './index.less';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  asyncFetchMetricsData: dispatch.service.asyncGetMetricsData,
  asyncGetMetricsSumData: dispatch.service.asyncGetMetricsSumData,
  asyncUpdateBaseLine: (key, value) =>
    dispatch.machine.update({
      [key]: value,
    }),
  updateMetricsFiltervalues: dispatch.service.updateMetricsFiltervalues,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  serviceMetric: state.serviceMetric,
  cluster: (state as any)?.cluster.cluster,
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
  const { asyncFetchMetricsData, asyncGetMetricsSumData, serviceMetric, loading, cluster, updateMetricsFiltervalues, metricsFilterValues, instanceList } = props;


  const location = useLocation();

  const [serviceType, setServiceType] = useState<string>('');
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [maxNum, setMaxNum] = useState(0);
  const [showLoading, setShowLoading] = useState<boolean>(false);

  useEffect(() => {
    setShowLoading(loading && metricsFilterValues.frequency === 0)
  }, [loading, metricsFilterValues.frequency])

  const metricOptions = useMemo<IMetricOption[]>(() => {
    if (serviceMetric.graphd.length === 0
      || serviceMetric.storaged.length === 0
      || serviceMetric.metad.length === 0) {
      return [];
    }
    let options = [];
    if (serviceType) {
      options = serviceMetric[`${serviceType}d`].map(item => {
        return {
          metric: item.metric,
          isSpaceMetric: item.isSpaceMetric,
          metricType: item.metricType,
          valueType: item.valueType,
        }
      })
    }
    return options;
  }, [serviceType, serviceMetric.graphd, serviceMetric.metad, serviceMetric.storaged]);

  const metricTypeMap = useMemo(() => {
    const map = {};
    metricOptions.forEach(option => {
      option.metricType.forEach(type => {
        const { key, value } = type;
        const metricItem = {
          metric: option.metric,
          isSpaceMetric: option.isSpaceMetric,
          metricType: option.metricType,
          valueType: option.valueType,
          metricFunction: value,
        };
        if (!map[key]) {
          map[key] = [metricItem];
        } else {
          map[key].push(metricItem)
        }
      })
    })
    return map;
  }, [metricOptions]);

  useEffect(() => {
    const match = /(\w+)-metrics/g.exec(location.pathname);
    console.log('hh', match, location.pathname);
    let serviceType = '';
    if (match) {
      serviceType = match[1] || 'graph';
    }
    setServiceType(serviceType);
  }, [location]);

  const metricCharts: any = useMemo(() => {
    if (Object.keys(metricTypeMap).length === 0) return [];
    const { metricType } = metricsFilterValues;
    console.log('metricTypeMap[metricType]', metricTypeMap[metricType])
    const charts = metricTypeMap[metricType].map((metric, i) => ({
      metric,
      chartInstance: undefined,
      index: i,
      baseLine: undefined,
    }));
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
    if (dataSources.length === 0) return;
    updateChart();
  }, [metricsFilterValues.instanceList, dataSources])

  const asyncGetMetricsData = async () => {
    const { timeRange, period, space, metricType } = metricsFilterValues;
    const [startTime, endTime] = calcTimeRange(timeRange);
    const getPromise = (chart) => {
      return new Promise((resolve, reject) => {
        const item = metricTypeMap[metricType].find(metricItem => metricItem.metric === chart.metric.metric);
        asyncFetchMetricsData({
          query: item.metricFunction + period,
          start: startTime,
          end: endTime,
          space,
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
          name: 'instanceName',
          aliasConfig,
        });
        setMaxNum(getMaxNum(data));
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
    console.log('metricChart.baseLine', metricChart.baseLine);
    metricChart.chartRef.updateChart(metricChart.baseLine);
  };

  const handleMetricChange = async values => {
    updateMetricsFiltervalues(values);
  };

  const getTickInterval = () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    return getProperTickInterval(endTimestamps - startTimestamps);
  }

  return (
    <Spin spinning={showLoading} wrapperClassName="service-detail">
      <div className='dashboard-detail'>
        <div className='filter'>
          <ServiceMetricsFilterPanel
            onChange={handleMetricChange}
            instanceList={instanceList}
            spaces={serviceMetric.spaces}
            metricTypes={Object.keys(metricTypeMap)}
            values={metricsFilterValues}
          />
        </div>
        <div className='detail-content'>
          {
            metricCharts.map((metricChart, i) => (
              <div key={i} className='chart-item'>
                <div className='chart-title'>
                  {metricChart.metric.metric}
                  <Popover
                    className={"chart-title-popover"}
                    // trigger="click"
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
                    yAxisMaximum={maxNum}
                    tickInterval={getTickInterval()}
                    baseLine={metricChart.baseLine}
                    options={{ padding: [20, 20, 60, 50] }}
                    ref={ref => metricChart.chartRef = ref}
                    renderChart={renderChart(i)}
                  />
                </div>
                <div
                  className="btn-icon-with-desc blue base-line"
                  onClick={handleBaseLineEdit(metricChart)}
                >
                  <Icon icon="#iconSetup" />
                  <span>{intl.get('common.baseLine')}</span>
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
