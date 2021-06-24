import { DatePicker, Form, Popover, Radio, Row, Spin } from 'antd';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, NEED_ADD_SUM_QUERYS, TIMEOPTIONS, TIME_INTERVAL_OPTIONS, getDataByType, getProperTickInterval } from '@assets/utils/dashboard';
import { FormInstance } from 'antd/lib/form';
import { updateQueryStringParameter } from '@assets/utils/url';
import React from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import { SERVICE_SUPPORT_METRICS, VALUE_TYPE } from '@assets/utils/promQL';
import { SERVICE_QUERY_PERIOD } from '@assets/utils/service';
import { Chart } from '@antv/g2';
import StatusPanel from '@assets/components/StatusPanel';
import { IStatRangeItem } from '@assets/utils/interface';
import { DashboardSelect, Option } from '@assets/components/DashboardSelect';
import dayjs from 'dayjs';
import ServiceHeader from '@assets/components/Service/ServiceHeader';

import LineChart from '@assets/components/Charts/LineChart';
import { configDetailChart, updateDetailChart } from '@assets/utils/chart/chart';
import Icon from '@assets/components/Icon';

import './index.less';

interface IState {
  serviceType: string,
  metricsValueType: VALUE_TYPE;
  defaultFormParams: {
    interval: number,
    instance: string,
    metric: string,
    metricFunction: string,
    period: number,
    timeRange: dayjs.Dayjs[]
  },
  instanceList: string[],
  data: IStatRangeItem[],
  totalData: IStatRangeItem[],
}

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetMetricsData: dispatch.service.asyncGetMetricsData,
    asyncGetMetricsSumData: dispatch.service.asyncGetMetricsSumData,
  };
};

const mapState = (state: IRootState) => {
  return {
    loading: state.loading.models.service,
    aliasConfig: state.app.aliasConfig,
    annotationLine: state.app.annotationLine,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState>, RouteComponentProps {}

class ServiceMetrics extends React.Component<IProps, IState> {
  chartInstance: Chart;
  pollingTimer: any;
  formRef = React.createRef<FormInstance>();
  constructor(props: IProps) {
    super(props);
    this.state = {
      serviceType: 'graph',
      defaultFormParams: {
        interval: DETAIL_DEFAULT_RANGE,
        instance: 'all',
        metric: SERVICE_SUPPORT_METRICS.graph[0].metric,
        metricFunction: SERVICE_SUPPORT_METRICS.graph[0].metricType[0].value,
        period: SERVICE_QUERY_PERIOD,
        timeRange: this.getDefaultTimeRange()
      },
      metricsValueType: SERVICE_SUPPORT_METRICS.graph[0].valueType,
      data: [],
      totalData: [],
      instanceList: []
    };
  }
  componentDidMount() {
    this.initialConfig();
  }

  getDefaultTimeRange = (interval?: number) => {
    const end = Date.now();
    const start = interval ? end - interval : end - DETAIL_DEFAULT_RANGE;
    return [dayjs(start), dayjs(end)];
  }
  initialConfig = () => {
    const { location: { pathname } } = this.props;
    const regx = /(\w+)-metrics/g;
    const match = regx.exec(pathname);
    let serviceType = '';
    if(match){
      serviceType = match[1];
    }
    if(serviceType) {
      const metricsList = SERVICE_SUPPORT_METRICS[serviceType];
      const timeRange = this.getDefaultTimeRange();
      const defaultFormParams = {
        interval: DETAIL_DEFAULT_RANGE,
        instance: 'all',
        metric: metricsList[0].metric,
        metricFunction: metricsList[0].metricType[0].value,
        period: SERVICE_QUERY_PERIOD,
        timeRange
      };
      if(this.formRef.current!) {
        this.formRef.current!.setFieldsValue(defaultFormParams);
      }
      this.setState({
        serviceType,
        defaultFormParams,
        metricsValueType: metricsList[0].valueType,
      }, this.pollingData);
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.initialConfig();
    }
  }
  componentWillUnmount() {
    this.clearPolling();
  }

  pollingData = async() => {
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

  handleServiceTypeChange = value => {
    window.location.href = updateQueryStringParameter(
      window.location.href,
      'type',
      value
    );
  }

  asyncGetMetricsData = async() => {
    const { timeRange, metric, metricFunction, period } = this.formRef.current!.getFieldsValue();
    const [startTime, endTime] = timeRange;
    let data = await this.props.asyncGetMetricsData({
      query: metricFunction+period,
      metric,
      start: startTime,
      end: endTime,
      timeInterval: period
    });
    if(NEED_ADD_SUM_QUERYS.includes(metric)){
      const totalData = await this.props.asyncGetMetricsSumData({
        query: metricFunction+period,
        metric,
        start: startTime,
        end: endTime,
        timeInterval: period
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
    const { serviceType, data } = this.state;
    const { aliasConfig } = this.props;
    const { timeRange, instance } = this.formRef.current!.getFieldsValue();
    const [startTime, endTime] = timeRange;
    const _data = getDataByType({ data, type: instance, name: 'instanceName', aliasConfig });
    updateDetailChart(this.chartInstance, {
      type: serviceType,
      tickInterval: getProperTickInterval(endTime - startTime),
    }).changeData(_data);
  }

  renderChart = (chartInstance: Chart) => {
    const { metricsValueType } = this.state;
    const { timeRange } = this.formRef.current!.getFieldsValue();
    const [startTime, endTime] = timeRange;
    this.chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTime - startTime),
      valueType: metricsValueType
    });
  }
  
  handleUpdateMetricType = (value: string) => {
    const { serviceType } = this.state;
    const selectedMetrics = SERVICE_SUPPORT_METRICS[serviceType].filter(item => item.metric === value)[0];
    this.formRef.current!.setFieldsValue({
      metricFunction: selectedMetrics.metricType[0].value
    });
    this.setState({ metricsValueType: selectedMetrics.valueType });
  }

  handleConfigUpdate = (changedValues) => {
    if(changedValues.interval) {
      const timeRange = this.getDefaultTimeRange(changedValues.interval);
      this.formRef.current!.setFieldsValue({ timeRange });
    } else if (changedValues.timeRange) {
      this.formRef.current!.setFieldsValue({ interval: null });
    } else if (changedValues.metric) {
      this.handleUpdateMetricType(changedValues.metric);
    }
    this.resetPollingData();
  }
  render() {
    const { serviceType, defaultFormParams, instanceList } = this.state;
    const { loading, aliasConfig, annotationLine } = this.props;
    return (<div className="service-metrics">
      <ServiceHeader 
        title={`${serviceType} ${intl.get('common.metric')}`} 
        icon={`#iconnav-${serviceType}`}
      />
      <div className="container">
        <Form
          className="metrics-params-form"
          ref={this.formRef}
          initialValues={defaultFormParams} 
          onValuesChange={this.handleConfigUpdate}
        >
          <Row>
            <div className="row-left">
              <Form.Item name="interval">
                <Radio.Group size="small">
                  {
                    TIMEOPTIONS.map(option => (
                      <Radio.Button key={option.value} value={option.value}>{intl.get(`component.dashboardDetail.${option.name}`)}</Radio.Button>
                    ))
                  }
                </Radio.Group>
              </Form.Item>
              <Form.Item name="timeRange">
                <DatePicker.RangePicker size="small" format="YYYY-MM-DD HH:mm" showTime={true} allowClear={false} />
              </Form.Item>
            </div>
            <Form.Item label={intl.get('service.serviceStatus')}>
              <StatusPanel type={serviceType} />
            </Form.Item>
          </Row>
          <Row className="metric-filter">
            <Form.Item label={intl.get('service.instance')} name="instance">
              <DashboardSelect>
                <Option key="all" value="all">all</Option>
                {
                  instanceList.map(value => (
                    <Option key={value} value={value}>{aliasConfig[value] || value}</Option>
                  ))
                }
              </DashboardSelect>
            </Form.Item>
            <Form.Item label={intl.get('service.metric')} name="metric">
              <DashboardSelect>
                {
                  SERVICE_SUPPORT_METRICS[serviceType].map(metric => (
                    <Option key={metric.metric} value={metric.metric}>{metric.metric}</Option>
                  ))
                }
              </DashboardSelect>
            </Form.Item>
            <Popover content="metric docs">
              <Icon className="metric-info-icon blue" icon="#iconnav-serverInfo" />
            </Popover>
            <Form.Item
              noStyle={true}
              shouldUpdate={(prevValues, currentValues) => prevValues.metric !== currentValues.metric}
            >
              {({ getFieldValue }) => {
                const metric = getFieldValue('metric');
                const typeList = SERVICE_SUPPORT_METRICS[serviceType].filter(item => item.metric === metric)[0].metricType;
                return getFieldValue('metric') ? <Form.Item label={intl.get('service.metricParams')} name="metricFunction">
                  <DashboardSelect>
                    {
                      typeList.map(params => (
                        <Option key={params.key} value={params.value}>{params.key}</Option>
                      ))
                    }
                  </DashboardSelect>
                </Form.Item> : null;}
              }
            </Form.Item>
            <Form.Item label={intl.get('service.period')} name="period">
              <DashboardSelect>
                {
                  TIME_INTERVAL_OPTIONS.map(value => (
                    <Option key={value} value={value}>{value}</Option>
                  ))
                }
              </DashboardSelect>
            </Form.Item>
          </Row>
        </Form>
        <Spin spinning={!!loading} wrapperClassName="nebula-chart">
          <LineChart baseLineNum={annotationLine[serviceType]} renderChart={this.renderChart} options={{ padding: [20, 20, 60, 50] }} />
        </Spin >
      </div>
    </div>);
  }
}
export default connect(mapState, mapDispatch)(withRouter(ServiceMetrics));