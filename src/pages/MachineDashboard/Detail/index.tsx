import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import { Popover, Spin } from 'antd';
import { connect } from 'react-redux';
import LineChart from '@/components/Charts/LineChart';
import {
  calcTimeRange,
  getBaseLineByUnit,
  getDataByType,
  getDiskData,
  getMachineRouterPath,
  getProperTickInterval,
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';

import { shouldCheckCluster } from '@/utils';
import MetricsFilterPanel from '@/components/MetricsFilterPanel';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';
import './index.less';
import { IMachineMetricOption } from '@/utils/interface';
import { RouteProps, useHistory } from 'react-router-dom';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUpdateBaseLine: (key, value) =>
    dispatch.setting.update({
      [key]: value,
    }),
  updateMetricsFiltervalues: dispatch.machine.updateMetricsFiltervalues,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  cluster: (state as any).cluster?.cluster,
  instances: state.machine.instanceList,
  metricsFilterValues: state.machine.metricsFilterValues,
});
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>, RouteProps {
  type: string;
  asyncGetDataSourceByRange: (params: {
    start: number;
    end: number;
    metric: string;
    clusterID?: string;
  }) => Promise<any>;
  metricOptions: IMachineMetricOption[];
  loading: true;
  dataTypeObj: any;
}

let pollingTimer: any;

function Detail(props: IProps) {

  const { metricOptions, loading, aliasConfig, asyncGetDataSourceByRange, asyncUpdateBaseLine, cluster, instances, metricsFilterValues, updateMetricsFiltervalues, type, dataTypeObj } = props;

  const [dataSources, setDataSources] = useState<any[]>([]);

  const [curMetricOptions, setMetricOptions] = useState<IMachineMetricOption[]>(metricOptions);

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const history = useHistory();

  const metricCharts: any = useMemo(() => (metricOptions || []).map(
    (metric, i) => ({
      metric,
      index: i,
      baseLine: undefined,
    })
  ), [metricOptions]);

  const metricNameList: string[] = useMemo(() => (
    (metricOptions || []).map((metric) => metric.metric)
  ), [metricOptions]);

  useEffect(() => {
    setShowLoading(loading && metricsFilterValues.frequency === 0)
  }, [loading, metricsFilterValues.frequency])

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
  }, [cluster, metricsFilterValues.frequency, metricsFilterValues.timeRange])

  useEffect(() => {
    updateChart();
  }, [metricsFilterValues.instanceList, dataSources, curMetricOptions])

  useEffect(() => () => {
    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }
  }, [])

  const getData = async () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    const getPromise = (chart) => {
      return new Promise((resolve, reject) => {
        asyncGetDataSourceByRange({
          start: startTimestamps,
          end: endTimestamps,
          metric: chart.metric.metric,
          clusterID: cluster?.id,
        }).then(res => {
          resolve(res);
        }).catch(e => {
          reject(e);
        });
      })
    }
    Promise.all(metricCharts.map(chart => getPromise(chart))).then((dataSources) => {
      setDataSources(dataSources)
    })
  };

  const pollingData = () => {
    getData();
    if (metricsFilterValues.frequency > 0) {
      pollingTimer = setTimeout(pollingData, metricsFilterValues.frequency);
    }
  };

  const handleMetricChange = async values => {
    updateMetricsFiltervalues(values);
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

  const renderChart = (i: number) => () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts[i].chartRef.configDetailChart({
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: metricCharts[i].metric.valueType,
    });
  };

  const updateChart = () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts.forEach((chart, i) => {
      const data = type === 'disk' ?
        getDiskData({
          data: dataSources[i] || [],
          type: metricsFilterValues.instanceList,
          nameObj: dataTypeObj,
          aliasConfig,
        }) :
        getDataByType({
          data: dataSources[i] || [],
          type: metricsFilterValues.instanceList,
          nameObj: dataTypeObj,
          aliasConfig,
        });
      const values = data.map(d => d.value) as number[];
      const maxNum = values.length > 0 ? Math.floor(Math.max(...values) * 100) / 100 : undefined;
      const minNum = values.length > 0 ? Math.floor(Math.min(...values) * 100) / 100 : undefined;
      if (chart.metric.metric === 'disk_writebytes') {
        debugger;
      }
      chart.chartRef.updateDetailChart({
        type,
        valueType: chart.metric.valueType,
        tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
        maxNum,
        minNum
      }).changeData(data);
    })
  };

  const handleBaseLineEdit = (metricChart) => () => {
    BaseLineEditModal.show({
      baseLine: metricChart.baseLine,
      valueType: metricChart.metric.valueType,
      onOk: (values) => handleBaseLineChange(metricChart, values),
    });
  };

  const handleRefreshData = () => {
    setShowLoading(loading);
    getData();
  }

  const handleMetricsChange = (values) => {
    if (values.length === 0) {
      setMetricOptions(metricOptions);
    } else {
      setMetricOptions(metricOptions.filter(metric => values.includes(metric.metric)));
    }
  }

  const getViewPath = (path: string): string => {
    if (cluster?.id) {
      return getMachineRouterPath(path, cluster.id);
    }
    return path;
  }

  const shouldShow = (metricItem) => {
    return curMetricOptions.find(item => item.metric === metricItem.metric)
  }

  const handleViewDetail = (metricItem) => () => {
    history.push(getViewPath(`/metrics-detail/${type}/${metricItem.metric.metric}`));
  }

  return (
    <Spin spinning={showLoading} wrapperClassName="machine-detail">
      <div className="dashboard-detail">
        <div className="filter">
          <MetricsFilterPanel
            onChange={handleMetricChange}
            instanceList={instances}
            values={metricsFilterValues}
            onRefresh={handleRefreshData}
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
                    baseLine={metricChart.baseLine}
                    // options={{ padding: [10, 70, 70, 70] }}
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

export default connect(mapState, mapDispatch)(Detail);
