import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
// import { uniq } from 'lodash';
import { Spin } from 'antd';
import { connect } from 'react-redux';
// import MachineDetail from '@/components/MachineDetail';
import LineChart from '@/components/Charts/LineChart';
import {
  calcTimeRange,
  // CARD_POLLING_INTERVAL,
  // DETAIL_DEFAULT_RANGE,
  getBaseLineByUnit,
  getDataByType,
  getMaxNum,
  getProperTickInterval,
} from '@/utils/dashboard';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
// import { IStatRangeItem } from '@/utils/interface';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS, VALUE_TYPE } from '@/utils/promQL';
import { trackEvent } from '@/utils/stat';
import Modal from '@/components/Modal';
import BaseLineEdit from '@/components/BaseLineEdit';

import './index.less';
import { shouldCheckCluster } from '@/utils';
import MetricsFilterPanel from '@/components/MetricsFilterPanel';
import Icon from '@/components/Icon';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUpdateBaseLine: (key, value) =>
    dispatch.setting.update({
      [key]: value,
    }),
  updateMetricsFiltervalues: dispatch.machine.updateMetricsFiltervalues,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  cpuBaseLine: state.setting.cpuBaseLine,
  memoryBaseLine: state.setting.memoryBaseLine,
  loadBaseLine: state.setting.loadBaseLine,
  diskBaseLine: state.setting.diskBaseLine,
  networkBaseLine: state.setting.networkBaseLine,
  cluster: (state as any).cluster?.cluster,
  instances: state.machine.instanceList,
  metricsFilterValues: state.machine.metricsFilterValues,
});
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
  type: string;
  asyncGetDataSourceByRange: (params: {
    start: number;
    end: number;
    metric: string;
    clusterID?: string;
  }) => Promise<any>;
  metricOptions: {
    metric: string;
    valueType: VALUE_TYPE;
  }[];
  loading: true;
}

let pollingTimer: any;

function Detail(props: IProps) {

  const { metricOptions, loading, aliasConfig, type, asyncGetDataSourceByRange, asyncUpdateBaseLine, cluster, instances, metricsFilterValues, updateMetricsFiltervalues } = props;

  const modalHandlerRef = useRef<any>(undefined);

  const [maxNum, setMaxNum] = useState<number>(0);
  const [dataSources, setDataSources] = useState<any[]>([]);

  const [showLoading, setShowLoading] = useState<boolean>(false);

  const metricCharts: any = useMemo(() => (metricOptions || []).map(
    (metric, i) => ({
      metric,
      chartInstance: undefined,
      index: i,
    })
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
  }, [metricsFilterValues.instanceList, dataSources])

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

  // const handleBaseLineChange = async value => {
  //   const { baseLine, unit } = value;
  //   await asyncUpdateBaseLine(
  //     `${type}BaseLine`,
  //     getBaseLineByUnit({
  //       baseLine,
  //       unit,
  //       valueType: currentMetricOption.valueType,
  //     }),
  //   );
  //   modalHandlerRef.current.hide();
  // };

  const renderChart = (i: number) => (chartInstance: Chart) => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts[i].chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: metricCharts[i].metric.valueType,
    });
  };

  const updateChart = () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    metricCharts.forEach((chart, i) => {
      if (chart.chartInstance) {
        const data = getDataByType({
          data: dataSources[i] || [],
          type: metricsFilterValues.instanceList,
          name: 'instance',
          aliasConfig,
        });
        setMaxNum(100);
        updateDetailChart(chart.chartInstance, {
          type,
          tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
        }).changeData(data);
        chart.chartInstance.autoFit = true;
      }
    })
  };

  const handleBaseLineEdit = () => {
    if (modalHandlerRef.current) {
      modalHandlerRef.current.show();
    }
  };

  const handleClose = () => {
    if (modalHandlerRef.current) {
      modalHandlerRef.current.hide();
    }
  };

  const baseLine = useMemo(() => props[`${type}BaseLine`], [type]);

  const getTickInterval = () => {
    const [startTimestamps, endTimestamps] = calcTimeRange(metricsFilterValues.timeRange);
    return getProperTickInterval(endTimestamps - startTimestamps);
  }

  return (
    <Spin spinning={showLoading} wrapperClassName="machine-detail">
      <div className="dashboard-detail">
        <div className="filter">
          <MetricsFilterPanel onChange={handleMetricChange} instanceList={instances} values={metricsFilterValues} />
        </div>
        <div className='detail-content'>
          {
            metricOptions.map((metricOption, i) => (
              <div key={i} className='chart-item'>
                <div className='chart-title'>{metricOption.metric}</div>
                <div className='chart-content'>
                  <LineChart
                    isDefaultScale={
                      metricOption.valueType === VALUE_TYPE.percentage
                    }
                    yAxisMaximum={maxNum}
                    tickInterval={getTickInterval()}
                    baseLine={baseLine}
                    options={{ padding: [10, 70, 70, 70] }}
                    renderChart={renderChart(i)}
                  />
                </div>
                <div
                  className="btn-icon-with-desc blue base-line"
                  onClick={handleBaseLineEdit}
                >
                  <Icon icon="#iconSetup" />
                  <span>{intl.get('common.baseLine')}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      {/* <Modal
        title="empty"
        className="machine-modal"
        width="550px"
        handlerRef={handler => (modalHandlerRef.current = handler)}
        footer={null}
      >
        <BaseLineEdit
          valueType={currentMetricOption.valueType}
          baseLine={baseLine || 0}
          onClose={handleClose}
          onBaseLineChange={handleBaseLineChange}
        />
      </Modal> */}
    </Spin>
  );
}

export default connect(mapState, mapDispatch)(Detail);
