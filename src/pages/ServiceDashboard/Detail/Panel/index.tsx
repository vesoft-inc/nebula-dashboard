import { DatePicker, Form, Radio, Row } from 'antd';
import {  
  DETAIL_DEFAULT_RANGE, 
  TIMEOPTIONS, 
  TIME_INTERVAL_OPTIONS, 
  getDefaultTimeRange
} from '@/utils/dashboard';
import React from 'react';
import intl from 'react-intl-universal';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IDispatch, IRootState } from '@/store';
import { connect } from 'react-redux';
import { FormInstance } from 'antd/lib/form';
import { SERVICE_SUPPORT_METRICS } from '@/utils/promQL';
import { SERVICE_QUERY_PERIOD } from '@/utils/service';
import { Chart } from '@antv/g2';
import StatusPanel from '@/components/StatusPanel';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { trackEvent } from '@/utils/stat';
import { MetricPopover } from '@/components/MetricPopover';
import dayjs from 'dayjs';

import '../index.less';

interface IState {
  defaultFormParams: {
    interval: number,
    instance: string,
    metric: string,
    metricFunction: string,
    period: number,
    timeRange: dayjs.Dayjs[]
  },
}

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetStatus: dispatch.service.asyncGetStatus,
  };
};

const mapState = (state: IRootState) => {
  return {
    aliasConfig: state.app.aliasConfig,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState>, RouteComponentProps {
  serviceType: string,
  metricsValueType: string;
  instanceList: string[];
  onTimeChange?: (interval:number) => void
  onServiceTypeChange: (type)=> void;
  onConfigUpdate: (values)=>void; 
  onMetricsValueTypeChange: (type)=> void;
}

class ServicePanel extends React.Component<IProps, IState> {
  chartInstance: Chart;
  pollingTimer: any;
  modalHandler;
  formRef = React.createRef<FormInstance>();
  constructor(props: IProps) {
    super(props);
    this.state = {
      defaultFormParams: {
        interval: DETAIL_DEFAULT_RANGE,
        instance: 'all',
        metric: SERVICE_SUPPORT_METRICS.graph[0].metric,
        metricFunction: SERVICE_SUPPORT_METRICS.graph[0].metricType[0].value,
        period: SERVICE_QUERY_PERIOD,
        timeRange: getDefaultTimeRange(),
      },
    };
  }

  componentDidMount() {
    this.initialConfig();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.initialConfig();
    }
  }

  handleTimeButtonClick = e => {
    const { onTimeChange } = this.props;
    if (onTimeChange) {
      onTimeChange(e.target.value);
    }
  }

  initialConfig = async () => {
    const { location: { pathname }, onServiceTypeChange, onMetricsValueTypeChange } = this.props;
    const regx = /(\w+)-metrics/g;
    const match = regx.exec(pathname);
    let serviceType = '';
    if(match){
      serviceType = match[1];
    }
    if(serviceType) {
      const metricsList = SERVICE_SUPPORT_METRICS[serviceType];
      const timeRange = getDefaultTimeRange();
      const defaultFormParams = {
        interval: DETAIL_DEFAULT_RANGE,
        instance: 'all',
        metric: metricsList[0].metric,
        metricFunction: metricsList[0].metricType[0].value,
        period: SERVICE_QUERY_PERIOD,
        timeRange
      };
      if(this.formRef.current) {
        this.formRef.current.setFieldsValue(defaultFormParams);
      }
      await onServiceTypeChange(serviceType);
      await onMetricsValueTypeChange(metricsList[0].valueType);
    }
  }

  handleConfigUpdate = (changedValues) => {
    const { serviceType } = this.props;
    switch (true) {
      case !!changedValues.interval:
        const timeRange = getDefaultTimeRange(changedValues.interval);
        this.formRef.current!.setFieldsValue({ timeRange });
        trackEvent(`${serviceType}_detail`, 'select_interval', `from_${serviceType}_detail`);
        break;
      case !!changedValues.timeRange:
        this.formRef.current!.setFieldsValue({ interval: null });
        trackEvent(`${serviceType}_detail`, 'select_time_range', `from_${serviceType}_detail`);
        break;
      case !!changedValues.metric:
        const selectedMetrics = SERVICE_SUPPORT_METRICS[serviceType].filter(item => item.metric === changedValues.metric)[0];
        this.formRef.current!.setFieldsValue({
          metricFunction: selectedMetrics.metricType[0].value
        });
        trackEvent(`${serviceType}_detail`, 'select_metric_type', `from_${serviceType}_detail`);
        break;
      default:
        break;
    }
    this.props.onConfigUpdate(changedValues);
  }

  disabledDate(current) {
    return current < dayjs().subtract(14, 'days').endOf('day') || current > dayjs().endOf('day'); 
  }

  render() {
    const { defaultFormParams } = this.state;
    const { serviceType, aliasConfig, instanceList, asyncGetStatus } = this.props;
    return (
      <Form
        className="metrics-params-form"
        ref={this.formRef}
        initialValues={defaultFormParams} 
        onValuesChange={this.handleConfigUpdate}
      >
        <Row>
          <div className="row-left">
            <Form.Item name="interval">
              <Radio.Group size="small" onChange={this.handleTimeButtonClick as any}>
                {
                  TIMEOPTIONS.map(option => (
                    <Radio.Button key={option.value} value={option.value}>{intl.get(`component.dashboardDetail.${option.name}`)}</Radio.Button>
                  ))
                }
              </Radio.Group>
            </Form.Item>
            <Form.Item name="timeRange">
              <DatePicker.RangePicker 
                disabledDate={this.disabledDate}
                size="small" 
                format="YYYY-MM-DD HH:mm" 
                showTime={true} 
                allowClear={false} 
              />
            </Form.Item>
          </div>
          <Form.Item label={intl.get('service.serviceStatus')}>
            <StatusPanel type={serviceType} getStatus={asyncGetStatus}/>
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
          <MetricPopover list={SERVICE_SUPPORT_METRICS[serviceType]}/>
          <Form.Item
            noStyle={true}
            shouldUpdate={(prevValues, currentValues) => prevValues.metric !== currentValues.metric}
          >
            {({ getFieldValue }) => {
              const metric = getFieldValue('metric');
              const typeList = SERVICE_SUPPORT_METRICS[serviceType].filter(item => item.metric === metric)[0].metricType;
              return metric ? <Form.Item label={intl.get('service.metricParams')} name="metricFunction">
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
      </Form>);
  }
}
export default connect(mapState, mapDispatch)(withRouter(ServicePanel));