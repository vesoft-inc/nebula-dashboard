import { Spin } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormInstance } from 'antd/lib/form';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import Panel from './Panel';
import { 
  CARD_POLLING_INTERVAL,
  DETAIL_DEFAULT_RANGE, 
  NEED_ADD_SUM_QUERYS, 
  getBaseLineByUnit,
  getDataByType, 
  getDefaultTimeRange,
  getMaxNum,
  getProperTickInterval
} from '@/utils/dashboard';
import { IDispatch, IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';
import { SERVICE_QUERY_PERIOD } from '@/utils/service';
import { IStatRangeItem } from '@/utils/interface';
import ServiceHeader from '@/components/Service/ServiceHeader';

import LineChart from '@/components/Charts/LineChart';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import BaseLineEdit from '@/components/BaseLineEdit';


import './index.less';

interface IState {
  serviceType: string,
  metricsValueType: VALUE_TYPE;
  instanceList: string[],
  data: IStatRangeItem[],
  maxNum: number,
  totalData: IStatRangeItem[],
  baseLine: number|undefined,
  interval: number,
  instance: string,
  metricSpace: string,
  metric: string,
  metricFunction: string,
  period: number,
  timeRange: dayjs.Dayjs[]
}

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetStatus: dispatch.service.asyncGetStatus,
    asyncGetMetricsData: dispatch.service.asyncGetMetricsData,
    asyncGetMetricsSumData: dispatch.service.asyncGetMetricsSumData,
    asyncUpdateBaseLine: (key, value) => dispatch.machine.update({
      [key]: value
    }),
  };
};

const mapState = (state: IRootState) => {
  return {
    loading: state.loading.models.service,
    aliasConfig: state.app.aliasConfig,
    serviceMetric: state.serviceMetric,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState>, RouteComponentProps {}

class ServiceDetail extends React.Component<IProps, IState> {
  chartInstance: Chart;
  pollingTimer: any;
  modalHandler;
  formRef = React.createRef<FormInstance>();

  constructor(props: IProps) {
    super(props);
    const { location: { pathname } } = this.props;
    const regx = /(\w+)-metrics/g;
    const match = regx.exec(pathname);
    let serviceType = '';
    if(match){
      serviceType = match[1] || 'graph';
    }
    this.state = {
      serviceType,
      metricsValueType: VALUE_TYPE.number,
      data: [],
      maxNum: 0,
      totalData: [],
      instanceList: [],
      baseLine: undefined,
      interval: DETAIL_DEFAULT_RANGE,
      instance: 'all',
      metricSpace: '',
      metric: '',
      metricFunction: '',
      period: SERVICE_QUERY_PERIOD,
      timeRange: getDefaultTimeRange(),
    };
  }

  componentDidMount() {
    const { serviceMetric } = this.props;
    const { serviceType } = this.state;
    if (serviceMetric[`${serviceType}d`].length > 0) {
      this.setState(
        {
          metric: serviceMetric[`${serviceType}d`][0]?.metric,
          metricFunction:
            serviceMetric[`${serviceType}d`][0]?.metricType?.[0].value,
          metricsValueType: serviceMetric[`${serviceType}d`][0]?.valueType,
        },
        this.pollingData,
      );
    }
  }

  /* eslint-disable-next-line */
    UNSAFE_componentWillReceiveProps(nextProps) {
    const { serviceMetric } = this.props;
    const { serviceType } = this.state;
    if (
      nextProps.serviceMetric[`${serviceType}d`] !==
        serviceMetric[`${serviceType}d`]
    ) {
      this.setState(
        {
          metric: nextProps.serviceMetric[`${serviceType}d`][0]?.metric,
          metricFunction:
              nextProps.serviceMetric[`${serviceType}d`][0]?.metricType?.[0]
                .value,
          metricsValueType:
              nextProps.serviceMetric[`${serviceType}d`][0]?.valueType,
        },
        this.pollingData,
      );
    }
  }


  componentWillUnmount() {
    this.clearPolling();
  }

  pollingData = async () => {
    await this.asyncGetMetricsData();
    this.pollingTimer = setTimeout(this.pollingData, CARD_POLLING_INTERVAL);
  }

  clearPolling = () => {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }
  resetPollingData = () => {
    this.clearPolling();
    this.pollingData();
  }

  asyncGetMetricsData = async () => {
    const { timeRange, metric, metricFunction, period } = this.state;
    const [startTime, endTime] = timeRange as any;
    let data = await this.props.asyncGetMetricsData({
      query: metricFunction + period,
      start: startTime,
      end: endTime
    });
    if(NEED_ADD_SUM_QUERYS.includes(metric)){
      const totalData = await this.props.asyncGetMetricsSumData({
        query: metricFunction + period,
        start: startTime,
        end: endTime
      });
      data = data.concat(totalData);
    }
    const instanceList = data.map(item => item.metric.instanceName);
    this.setState({
      data,
      instanceList
    });
    this.updateChart();
  }

  updateChart = () => {
    const { timeRange, instance, serviceType, data } = this.state;
    const { aliasConfig } = this.props;
    const [startTime, endTime] = timeRange as any;
    const _data = getDataByType({ data, type: instance, name: 'instanceName', aliasConfig });
    this.setState({
      maxNum: getMaxNum(_data)
    });
    updateDetailChart(this.chartInstance, {
      type: serviceType,
      tickInterval: getProperTickInterval(endTime - startTime),
    }).changeData(_data);
  }

  renderChart = (chartInstance: Chart) => {
    const { timeRange, metricsValueType } = this.state;
    const [startTime, endTime] = timeRange as any;
    this.chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTime - startTime),
      valueType: metricsValueType
    });
  }

  handleServiceTypeChange=(serviceType) => {
    this.setState({
      serviceType
    }, this.pollingData);
  }

  handleMetricsValueTypeChange=(metricsValueType) => {
    this.setState({
      metricsValueType
    });
  }

  handleIntervalChange = (interval) => {
    this.setState({
      timeRange:getDefaultTimeRange(interval),
    }, this.asyncGetMetricsData);
  }

  handleConfigUpdate = (changedValues) => {
    const { serviceMetric } = this.props;
    const { serviceType } = this.state;
    if(changedValues.metric){
      const selectedMetrics = serviceMetric[`${serviceType}d`].filter(item => item.metric === changedValues.metric)[0];
      this.setState({ 
        metric: changedValues.metric,
        metricsValueType: selectedMetrics.valueType,
        metricFunction: selectedMetrics.metricType[0].value,
        baseLine: undefined
      }, this.resetPollingData);
    }else{
      this.setState(changedValues, this.resetPollingData);
    }
  }

  handleBaseLineEdit=() => {
    if(this.modalHandler){
      this.modalHandler.show();
    }
  }

  handleClose=() => {
    if(this.modalHandler){
      this.modalHandler.hide();
    }
  }

  handleBaseLineChange= (value ) => {
    const { baseLine, unit } = value;
    const { metricsValueType } = this.state;
    this.setState({
      baseLine: getBaseLineByUnit({ baseLine, unit, valueType: metricsValueType }),
    }, this.handleClose);
  }
  render() {
    const { 
      metricsValueType, 
      interval, 
      instance, 
      metric,
      maxNum, 
      metricSpace, 
      metricFunction, 
      period, 
      timeRange, 
      serviceType, 
      baseLine, 
      instanceList 
    } = this.state;
    const { loading } = this.props;
    const defaultFormParams = {
      interval,
      instance,
      metric,
      space: metricSpace,
      metricFunction,
      period,
      timeRange,
    };
    return (<div className="service-metrics">
      <ServiceHeader 
        title={`${serviceType} ${intl.get('common.metric')}`} 
        icon={`#iconnav-${serviceType}`}
      />
      <div className="container">
        <Panel 
          instanceList={instanceList}
          serviceType={serviceType}
          defaultFormParams={defaultFormParams}
          onTimeChange={this.handleIntervalChange}
          onServiceTypeChange={this.handleServiceTypeChange}
          onMetricsValueTypeChange={this.handleMetricsValueTypeChange}
          onConfigUpdate={this.handleConfigUpdate} 
        />
        <div className="btn-icon-with-desc blue" onClick={this.handleBaseLineEdit} >
          <Icon icon="#iconSetup" />
          <span>{intl.get('common.baseLine')}</span>
        </div>
        <Spin spinning={!!loading} wrapperClassName="nebula-chart">
          <LineChart yAxisMaximum={maxNum} baseLine={baseLine} renderChart={this.renderChart} options={{ padding: [20, 20, 60, 50] }} />
        </Spin >
        <Modal
          title="empty"
          className="service-modal"
          width="550px"
          handlerRef={handler => (this.modalHandler = handler)}
          footer={null}
        >
          <BaseLineEdit
            valueType={metricsValueType}
            baseLine={baseLine || 0}
            onClose={this.handleClose}
            onBaseLineChange={this.handleBaseLineChange}
          />
        </Modal>
      </div>
    </div>);
  }
}
export default connect(mapState, mapDispatch)(withRouter(ServiceDetail));