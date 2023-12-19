import { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
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
  getTickIntervalByGap,
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';

import { getQueryRangeInfo } from '@/utils';
import MetricsFilterPanel from '@/components/MetricsFilterPanel';
import Icon from '@/components/Icon';
import BaseLineEditModal from '@/components/BaseLineEditModal';
import { LINUX as PROMQL } from '@/utils/promQL';
import './index.less';
import { BatchQueryItem, IMachineMetricOption } from '@/utils/interface';
import { RouteProps, useHistory } from 'react-router-dom';
import { asyncBatchQueries } from '@/requests';

interface MetricChartItem {
  metric: IMachineMetricOption;
  baseLine: any;
  chartRef?: any;
}

const mapDispatch: any = (dispatch: IDispatch) => ({
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
  metricOptions: IMachineMetricOption[];
  dataTypeObj: any;
}

function Detail(props: IProps) {

  const { metricOptions, aliasConfig, cluster, instances, metricsFilterValues, updateMetricsFiltervalues, type, dataTypeObj } = props;

  const [curMetricOptions, setMetricOptions] = useState<IMachineMetricOption[]>([]);

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const history = useHistory();

  const pollingTimerRef = useRef<any>(null);

  const metricCharts: any = useMemo(() => (metricOptions || []).map(
    (metric) => ({
      metric,
      baseLine: undefined,
    })
  ), [metricOptions]);

  const metricNameList: string[] = useMemo(() => (
    (metricOptions || []).map((metric) => metric.metric)
  ), [metricOptions]);

  useEffect(() => {
    setMetricOptions(metricOptions)
  }, [metricOptions])

  useEffect(() => {
    if (cluster?.id && instances.length > 0) {
      getData(true);
    }
  }, [metricCharts, cluster, instances])

  useEffect(() => {
    clearPolling();
    pollingData();
    return () => {
      clearPolling();
    }
  }, [metricsFilterValues.frequency])

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  const getData = async (showLoading: boolean = false, updateMetricCharts: MetricChartItem[] = metricCharts) => {
    if (updateMetricCharts.length === 0 || !cluster?.id) return;
    showLoading && setShowLoading(true);
    // const finMetricCharts = updateMetricCharts.filter(chart => chart.visible);
    const [startTime, endTime] = calcTimeRange(metricsFilterValues.timeRange);
    const { start, end, step } = getQueryRangeInfo(startTime, endTime);
    const queries: BatchQueryItem[] = updateMetricCharts.map((chart: MetricChartItem) => ({
      refId: chart.metric.metric,
      query: PROMQL(cluster.id)[chart.metric.metric],
      start,
      end,
      step
    }));
    const data: any = await asyncBatchQueries(queries);
    const { results } = data;
    if (!results) return;
    updateMetricCharts.forEach((chart: MetricChartItem) => {
      const datasource = results[chart.metric.metric].result;
      updateChart(chart, datasource);
    })
    showLoading && setShowLoading(false);
  };

  const pollingData = () => {
    getData(true);
    if (metricsFilterValues.frequency > 0) {
      pollingTimerRef.current = setInterval(getData, metricsFilterValues.frequency);
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

  const updateChart = (metricChart: MetricChartItem, dataSource: any) => {
    const data = type === 'disk' ?
      getDiskData({
        data: dataSource || [],
        type: metricsFilterValues.instanceList,
        nameObj: dataTypeObj,
        aliasConfig,
        instanceList: instances,
      }) :
      getDataByType({
        data: dataSource || [],
        type: metricsFilterValues.instanceList,
        nameObj: dataTypeObj,
        aliasConfig,
        instanceList: instances,
      });
    const values = data.map(d => d.value) as number[];
    const maxNum = values.length > 0 ? Math.floor(Math.max(...values) * 100) / 100 : undefined;
    const minNum = values.length > 0 ? Math.floor(Math.min(...values) * 100) / 100 : undefined;
    const realRange = data.length > 0 ? (data[data.length - 1].time - data[0].time) : 0;
    let tickInterval = getTickIntervalByGap(Math.floor(realRange / 10)); // 10 ticks max
    metricChart.chartRef.updateDetailChart({
      type,
      valueType: metricChart.metric.valueType,
      tickInterval,
      maxNum,
      minNum
    }).changeData(data);
  };

  const handleBaseLineEdit = (metricChart) => () => {
    BaseLineEditModal.show({
      baseLine: metricChart.baseLine,
      valueType: metricChart.metric.valueType,
      onOk: (values) => handleBaseLineChange(metricChart, values),
    });
  };

  const handleRefreshData = () => {
    getData(true);
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
          }
        </div>
      </div>
    </Spin>
  );
}

export default connect(mapState, mapDispatch)(Detail);
