import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getBaseLineByUnit, getDataByType, getProperTickInterval } from '@assets/utils/dashboard';
import { uniq } from 'lodash';
import { configDetailChart, updateDetailChart } from '@assets/utils/chart/chart';
import { IStatRangeItem } from '@assets/utils/interface';
import { Spin } from 'antd';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import './index.less';
import { SUPPORT_METRICS, VALUE_TYPE } from '@assets/utils/promQL';
import { trackEvent } from '@assets/utils/stat';
import Modal from '@assets/components/Modal';
import BaseLineEdit from '@assets/components/BaseLineEdit';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncUpdateBaseLine: (key, value) => dispatch.setting.update({
      [key]: value
    }),
  };
};

const mapState = (state: IRootState) => {
  return {
    aliasConfig: state.app.aliasConfig,
    diskBaseLine: state.setting.diskBaseLine,
    cpuBaseLine: state.setting.cpuBaseLine,
    memoryBaseLine: state.setting.memoryBaseLine,
    networkOutBaseLine: state.setting.networkOutBaseLine,
    networkInBaseLine: state.setting.networkInBaseLine,
    loadBaseLine: state.setting.loadBaseLine,
  };
};
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
  type: string
  asyncGetDataSourceByRange: (params: {start: number, end: number, metric: string}) => void;
  dataSource: IStatRangeItem[];
  metricOptions: {
    metric: string;
    valueType: VALUE_TYPE
  }[] 
  loading: true;
}

interface IState {
  startTimestamps: number,
  endTimestamps: number,
  currentInstance: string,
  currentMetricOption: typeof SUPPORT_METRICS.cpu[0],
}

class Detail extends React.Component<IProps, IState> {
  pollingTimer: any;
  chartInstance: Chart;
  modalHandler;
  constructor(props: IProps) {
    super(props);
    const endTimestamps = Date.now();
    this.state = {
      endTimestamps,
      startTimestamps: endTimestamps - DETAIL_DEFAULT_RANGE,
      currentInstance: localStorage.getItem('detailType') || 'all',
      currentMetricOption: props.metricOptions[0],
    };
  }

  componentDidMount() {
    this.pollingData();
  }

  componentWillUnmount() {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  getData = async() => {
    const { startTimestamps, endTimestamps, currentMetricOption } = this.state;
    await this.props.asyncGetDataSourceByRange({
      start: startTimestamps,
      end: endTimestamps,
      metric: currentMetricOption.metric,
    });
    this.updateChart();
  }

  pollingData = () => {
    this.getData();
    this.pollingTimer = setTimeout(this.pollingData, CARD_POLLING_INTERVAL);
  }

  handleIntervalChange = (startTimestamps, endTimestamps) => {
    const { type } = this.props;
    trackEvent(`${type}_detail`, 'select_interval', `from_${type}_detail`);
    this.setState({
      startTimestamps,
      endTimestamps
    }, this.getData);
  }

  handleInstanceChange = (instance) => {
    const { type } = this.props;
    localStorage.setItem('detailType', instance);
    this.setState({
      currentInstance: instance,
    }, this.updateChart);
    trackEvent(`${type}_detail`, 'select_data_type', `from_${type}_detail`);
  }

  handleMetricChange = (metric) => {
    const { metricOptions, type } = this.props;
    const metricOption = metricOptions.find(option => option.metric === metric);
    trackEvent(`${type}_detail`, 'select_metric_query', `from_${type}_detail`);
    if (metricOption) {
      this.setState({
        currentMetricOption: metricOption
      }, this.getData);
    }
  }

  handleBaseLineChange= async(value) => {
    const { type, asyncUpdateBaseLine } = this.props;
    const { baseLine, unit } = value;
    await asyncUpdateBaseLine(`${type}BaseLine`, getBaseLineByUnit(baseLine, unit));
    this.modalHandler.hide();
  }

  renderChart = (chartInstance: Chart) => {
    const { currentMetricOption } = this.state;
    const { startTimestamps, endTimestamps } = this.state;
    this.chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
      valueType: currentMetricOption.valueType,
    });
  }

  updateChart = () => {
    const { dataSource, type, aliasConfig } = this.props;
    const { currentInstance, startTimestamps, endTimestamps } = this.state;
    const data = getDataByType({ data:dataSource, type:currentInstance, name: 'instance', aliasConfig });
    updateDetailChart(this.chartInstance, {
      type,
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
    }).changeData(data);
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
  
  render() {
    const { startTimestamps, endTimestamps, currentInstance, currentMetricOption } = this.state;
    const { dataSource, metricOptions, loading, aliasConfig, type } = this.props;
    const instances = uniq(dataSource.map(instance => instance.metric.instance));
    const typeOptions = [
      {
        name: intl.get('device.detail.all'),
        value: 'all',
      },
      ...instances.map(instance => ({
        name: aliasConfig[instance] || instance,
        value: instance,
      }))
    ];
    const baseLine = this.props[`${type}BaseLine`];
    return (
      <Spin spinning={loading} wrapperClassName="machine-detail">
        <DashboardDetail
          key={currentMetricOption.metric}
          className="cpu-detail"
          title={intl.get('device.detail.cpu')}
          onTimeChange={this.handleIntervalChange}
          startTimestamps={startTimestamps}
          endTimestamps={endTimestamps}
          typeOptions={typeOptions}
          currentType={currentInstance}
          metricOptions={metricOptions}
          onTypeChange={this.handleInstanceChange}
          currentMetricOption={currentMetricOption}
          onMetricChange={this.handleMetricChange}
          onBaseLineEdit={this.handleBaseLineEdit}
        >
          <LineChart baseLine={baseLine} options={{ padding: [10, 70, 70, 70] }} renderChart={this.renderChart} />
        </DashboardDetail>
        <Modal
          title="empty"
          className="modal-baseLine"
          width="550px"
          handlerRef={handler => (this.modalHandler = handler)}
          footer={null}
        >
          <BaseLineEdit
            type={type}
            baseLine={baseLine}
            onClose={this.handleClose}
            onBaseLineChange={this.handleBaseLineChange}
          />
        </Modal>
      </Spin>
    );
  }
}

export default connect(mapState, mapDispatch)(Detail);