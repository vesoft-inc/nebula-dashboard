import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';

import MetricsFilterPanel from '@/components/MetricsFilterPanel';
import ServiceMetricsFilterPanel from '@/components/ServiceMetricsFilterPanel';
import { IDispatch, IRootState } from '@/store';

import styles from './index.module.less';
import LineChart from '@/components/Charts/LineChart';
import { useParams } from 'react-router-dom';
import { calcTimeRange, getBaseLineByUnit, getDataByType, getDiskData, getMetricsUniqName, getProperTickInterval } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { Chart } from '@antv/g2';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
import { shouldCheckCluster } from '@/utils';
import { Popover, Spin } from 'antd';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';
import { getQueryByMetricType } from '@/utils/metric';

interface Props
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
}

enum MetricTypeName {
  Disk = 'disk',
  Cpu = 'cpu',
  Memory = 'memory',
  Load = 'load',
  Network = 'network',
  Graphd = 'graphd',
  Metad = 'metad',
  Storaged = 'storaged'
}

function isServiceMetric(metricType: MetricTypeName) {
  return metricType === MetricTypeName.Metad || metricType === MetricTypeName.Graphd || metricType === MetricTypeName.Storaged;
}

function getMetricSecene(metricType: MetricTypeName) {
  switch (metricType) {
    case MetricTypeName.Disk:
      return MetricScene.DISK;
    case MetricTypeName.Cpu:
      return MetricScene.CPU;
    case MetricTypeName.Memory:
      return MetricScene.MEMORY;
    case MetricTypeName.Load:
      return MetricScene.LOAD;
    case MetricTypeName.Network:
      return MetricScene.NETWORK;
    default:
      return MetricScene.SERVICE;
  }
}

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  cluster: (state as any).cluster?.cluster,
  serviceMetric: state.serviceMetric,
  instances: state.machine.instanceList,
  serviceInstanceList: state.service.instanceList,
  metricsFilterValues: state.machine.metricsFilterValues,
  serviceMetricsFilterValues: state.service.metricsFilterValues,
  serviceLoading: state.loading.models.service,
  machineLoading: state.loading.models.machine,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUpdateBaseLine: (key, value) =>
    dispatch.setting.update({
      [key]: value,
    }),
  updateMetricsFiltervalues: dispatch.machine.updateMetricsFiltervalues,
  updateServiceMetricsFiltervalues: dispatch.service.updateMetricsFiltervalues,
  asyncFetchMachineMetricsData: dispatch.machine.asyncGetMetricsData,
  asyncFetchServiceMetricsData: dispatch.service.asyncGetMetricsData,
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
});

let pollingTimer: any;

function MetricDetail(props: Props) {

  const { cluster, type, metricsFilterValues, serviceMetricsFilterValues,
    updateMetricsFiltervalues, updateServiceMetricsFiltervalues, instances, serviceInstanceList,
    asyncFetchMachineMetricsData, aliasConfig, serviceMetric, asyncFetchServiceMetricsData, asyncGetSpaces,
    serviceLoading, machineLoading } = props;

  const { metricName, metricType } = useParams<any>();

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const curMetricsFilterValues = useMemo(() => isServiceMetric(metricType) ? serviceMetricsFilterValues : metricsFilterValues, [type, metricsFilterValues, serviceMetricsFilterValues]);

  const metricOption = useMemo(() => {
    let metrics: any[] = [];
    if (isServiceMetric(metricType)) {
      metrics = serviceMetric[metricType];
    } else {
      metrics = SUPPORT_METRICS[metricType];
    }
    console.log('metrics', metrics)
    const metricItem = metrics.find(item => item.metric === metricName) || {
      metric: '',
      valueType: '',
      metricType: [],
      aggregations: [],
    }
    return metricItem
  }, [metricName, metricType, serviceMetric])

  useEffect(() => {
    if (isServiceMetric(metricType)) {
      setShowLoading(serviceLoading && curMetricsFilterValues.frequency === 0)
    } else {
      setShowLoading(machineLoading && curMetricsFilterValues.frequency === 0)
    }
  }, [metricType, serviceLoading, machineLoading, curMetricsFilterValues.frequency]);

  const metricChartRef = useRef<any>();

  const metricChart: any = useMemo(() => {
    if (metricChartRef.current) {
      const res = {
        ...metricChartRef.current,
        metric: metricOption,
      }
      return res
    }
    const res = {
      metric: metricOption,
      chartInstance: undefined,
      baseLine: undefined,
    }
    metricChartRef.current = res;
    return res
  }, [metricOption]);

  useEffect(() => {
    if (!isServiceMetric(metricType)) return;
    const [start, end] = calcTimeRange(curMetricsFilterValues.timeRange);
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
  }, [curMetricsFilterValues.timeRange, cluster, metricType])

  useEffect(() => {
    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }
    if (shouldCheckCluster()) {
      if (cluster?.id) {
        pollingData();
      }
    } else {
      pollingData();
    }
  }, [cluster, curMetricsFilterValues.frequency, curMetricsFilterValues.timeRange,
    curMetricsFilterValues.metricType, curMetricsFilterValues.period, curMetricsFilterValues.space, metricOption]);

  const pollingData = () => {
    getData();
    if (curMetricsFilterValues.frequency > 0) {
      pollingTimer = setTimeout(pollingData, curMetricsFilterValues.frequency);
    }
  };

  useEffect(() => {
    updateChart();
  }, [curMetricsFilterValues.instanceList, dataSource])

  const updateChart = () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(curMetricsFilterValues.timeRange);
    const metricScene = getMetricSecene(metricType);
    if (metricChart.chartInstance) {
      const data = metricType === MetricTypeName.Disk ?
        getDiskData({
          data: dataSource || [],
          type: curMetricsFilterValues.instanceList,
          nameObj: getMetricsUniqName(metricScene),
          aliasConfig,
        }) :
        getDataByType({
          data: dataSource || [],
          type: curMetricsFilterValues.instanceList,
          nameObj: getMetricsUniqName(metricScene),
          aliasConfig,
        });
      const values = data.map(d => d.value) as number[];
      const maxNum = values.length > 0 ? Math.floor(Math.max(...values) * 100) / 100 : undefined;
      const minNum = values.length > 0 ? Math.floor(Math.min(...values) * 100) / 100 : undefined;
      updateDetailChart(metricChart.chartInstance, {
        type,
        tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
        maxNum,
        minNum,
      }).changeData(data);
      metricChart.chartInstance.autoFit = true;
    }
  };

  const metricTypeMap = useMemo(() => {
    const map = {};
    if (metricOption && isServiceMetric(metricType)) {
      metricOption.aggregations.forEach(type => {
        if (!map[type]) {
          map[type] = [metricOption];
        } else {
          map[type].push(metricOption)
        }
      })
    }
    return map;
  }, [metricType, metricOption])

  const getData = async () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(curMetricsFilterValues.timeRange);
    if (isServiceMetric(metricType)) {
      const { period, space, metricType: aggregration } = curMetricsFilterValues;
      const item = metricTypeMap[aggregration]?.find(metricItem => metricItem.metric === metricChart.metric.metric);
      if (item) {
        asyncFetchServiceMetricsData({
          query: getQueryByMetricType(item, aggregration, period),
          start: startTimestamps,
          end: endTimestamps,
          space: metricType === MetricTypeName.Graphd ? space : undefined,
          clusterID: cluster?.id,
        }).then(res => {
          setDataSource(res);
        });
      }
    } else {
      asyncFetchMachineMetricsData({
        start: startTimestamps,
        end: endTimestamps,
        metric: metricChart.metric.metric,
        clusterID: cluster?.id,
      }).then(res => {
        setDataSource(res);
      });
    }
  };

  const handleMetricChange = async values => {
    if (isServiceMetric(metricType)) {
      updateServiceMetricsFiltervalues(values)
    } else {
      updateMetricsFiltervalues(values);
    }
  };

  const handleRefresh = () => {
    if (isServiceMetric(metricType)) {
      setShowLoading(!!serviceLoading);
    } else {
      setShowLoading(!!machineLoading);
    }
    getData();
  }

  const renderChart = (chartInstance: Chart) => {
    const [startTimestamps, endTimestamps] = calcTimeRange(curMetricsFilterValues.timeRange);
    metricChart.chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: metricChart.metric.valueType,
    });
  }

  const handleBaseLineEdit = () => {
    BaseLineEditModal.show({
      baseLine: metricChart.baseLine,
      valueType: metricChart.metric.valueType,
      onOk: (values) => handleBaseLineChange(metricChart, values),
    });
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

  return (
    <Spin spinning={showLoading}>
      <div className={styles.dashboardDetail}>
        <div className={styles.commonHeader}>
          {
            isServiceMetric(metricType) ? (
              <ServiceMetricsFilterPanel
                onChange={handleMetricChange}
                instanceList={serviceInstanceList}
                spaces={metricType === MetricTypeName.Graphd ? serviceMetric.spaces : undefined}
                values={curMetricsFilterValues}
                onRefresh={handleRefresh}
              />
            ) : (
              <MetricsFilterPanel
                onChange={handleMetricChange}
                instanceList={instances}
                values={curMetricsFilterValues}
                onRefresh={handleRefresh}
              />
            )
          }
        </div>
        <div className={styles.detailContent}>
          <div className={styles.chartItem}>
            <div className='chart-title'>
              {metricChart.metric?.metric}
              <Popover
                className={"chart-title-popover"}
                content={
                  <div>{intl.get(`metric_description.${metricChart.metric?.metric}`)}</div>
                }
              >
                <Icon className="metric-info-icon blue chart-title-desc" icon="#iconnav-serverInfo" />
              </Popover>
            </div>
            <div className={styles.chartContent}>
              <LineChart
                isDefaultScale
                yAxisMaximum={100}
                options={{ padding: [10, 70, 70, 70] }}
                ref={ref => metricChart.chartRef = ref}
                renderChart={renderChart}
              />
            </div>
            <div className="action-icons">
              <div
                className="btn-icon-with-desc blue base-line"
                onClick={handleBaseLineEdit}
              >
                <Icon icon="#iconSetup" />
                <span>{intl.get('common.baseLine')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default connect(mapState, mapDispatch)(MetricDetail);