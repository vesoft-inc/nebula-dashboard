import { Empty, Popover, Spin, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState, useRef } from 'react';
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
// import { VALUE_TYPE } from '@/utils/promQL';
import { IServiceMetricItem, MetricScene, ServiceMetricsPanelValue, ServiceName } from '@/utils/interface';

import LineChart from '@/components/Charts/LineChart';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';

import ServiceMetricsFilterPanel from '@/components/ServiceMetricsFilterPanel';
import { shouldCheckCluster } from '@/utils';

import './index.less';
import { ClusterServiceNameMap, DEPENDENCY_PROCESS_TYPES, getQueryByMetricType } from '@/utils/metric';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
  asyncFetchMetricsData: dispatch.service.asyncGetMetricsData,
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

function ServiceDetail(props: IProps) {
  const { asyncFetchMetricsData, serviceMetric, loading, cluster, updateMetricsFiltervalues, metricsFilterValues, instanceList, asyncGetSpaces } = props;

  const location = useLocation();

  const [serviceType, setServiceType] = useState<string>('');
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [isDependencyService, setIsDependencyService] = useState<boolean>(false);

  const pollingTimerRef = useRef<any>(null);

  const history = useHistory();

  useEffect(() => {
    setShowLoading(loading && metricsFilterValues.frequency === 0)
  }, [loading, metricsFilterValues.frequency]);

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

  const [metricCharts, setMetricCharts] = useState<{ metric:IServiceMetricItem,index:number,baseLine:any,chartRef?:any,visible:boolean }[]>([]);

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
    setMetricCharts(metricOptions.map((metric, index) => ({ metric, index, baseLine: null,visible:true })));
  }, [metricOptions])

  useEffect(() => {
    if (dataSources.length === 0) return;
    updateChart();
  }, [metricsFilterValues.instanceList, dataSources, metricCharts])

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
      pollingData();
    }
  }, [metricCharts])

  const asyncGetMetricsData = async () => {
    const { timeRange, period="5", space,  } = metricsFilterValues;
    const [startTime, endTime] = calcTimeRange(timeRange);
    const getPromise = (chart) => {
      return new Promise((resolve, reject) => {
        const item: IServiceMetricItem = chart.metric;
        const aggregation = item.aggregations[0] as AggregationType;
        asyncFetchMetricsData({
          query: getQueryByMetricType(item, aggregation, period),
          start: startTime,
          end: endTime,
          space: serviceType === ServiceName.GRAPHD ? space : undefined,
          clusterID: cluster?.id,
          isRawMetric: item.isRawMetric,
          aggregation
        }).then(res => {
          resolve(res);
        }).catch(e => {
          reject(e)
        });
      })
    }
    if (metricCharts.length === 0) return;
    Promise.all(metricCharts.map((chart, i) => {
      if (chart.visible) {
        return getPromise(chart);
      } else {
        return Promise.resolve(dataSources[i]);
      }
    })).then((dataSources) => {
      setDataSources(dataSources)
    })
  };


  const pollingData = async () => {
    asyncGetMetricsData();
    if (metricsFilterValues.frequency > 0) {
      pollingTimerRef.current = setInterval(asyncGetMetricsData, metricsFilterValues.frequency);
    }
  };

  const updateChart = () => {
    const { aliasConfig } = props;
    const { instanceList } = metricsFilterValues;
    metricCharts.forEach((chart, i) => {
      const data = getDataByType({
        data: dataSources[i] || [],
        type: instanceList,
        nameObj: getMetricsUniqName(MetricScene.SERVICE),
        aliasConfig,
        instanceList: props.instanceList,
      });
      const realRange = data.length>0?(data[data.length-1].time - data[0].time):0;
      const tickInterval = getTickIntervalByGap(Math.floor(realRange / 10)); // 10 ticks max
      chart.chartRef.updateDetailChart({
        type: serviceType,
        valueType: chart.metric.valueType,
        tickInterval,
        maxNum: getMaxNum(data),
        minNum: getMinNum(data),
      }).changeData(data);
    })
  };

  const renderChart = (i: number) => () => {
    const chart = metricCharts[i];
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    chart.chartRef.configDetailChart({
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: chart.metric.valueType,
    });
    if (chart.visible&&chart.baseLine) {
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
    setShowLoading(!!loading);
    asyncGetMetricsData();
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

  return (
    <Spin spinning={showLoading} wrapperClassName="service-detail">
      <div className='dashboard-detail'>
        <div className='filter'>
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
        <div className='detail-content'>
          {
            metricCharts.length ? (
              metricCharts.map((metricChart, i) => (
                <div key={i} className='chart-item' style={{ display: metricChart.visible ? 'flex' : 'none' }}>
                  <div className='chart-title'>
                    {metricChart.metric.metric.length > 40 ? (
                      <Tooltip title={metricChart.metric.metric}>{metricChart.metric.metric.slice(0, 37) + '...'}</Tooltip>
                    ) : metricChart.metric.metric}
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
                      // baseLine={metricChart.baseLine}
                      // options={{ padding: [20, 20, 60, 50] }}
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
                      <Icon icon="#iconSet_up" />
                      <span>{intl.get('common.baseLine')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-content">
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
