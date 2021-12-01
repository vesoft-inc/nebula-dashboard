import React from 'react';
import MachineDetail from '@/components/MachineDetail';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import LineChart from '@/components/Charts/LineChart';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getBaseLineByUnit, getDataByType, getMaxNum, getProperTickInterval } from '@/utils/dashboard';
import { uniq } from 'lodash';
import { configDetailChart, updateDetailChart } from '@/utils/chart/chart';
import { IStatRangeItem } from '@/utils/interface';
import { Spin } from 'antd';
import { IDispatch, IRootState } from '@/store';
import { connect } from 'react-redux';
import './index.less';
import { SUPPORT_METRICS, VALUE_TYPE } from '@/utils/promQL';
import { trackEvent } from '@/utils/stat';
import Modal from '@/components/Modal';
import BaseLineEdit from '@/components/BaseLineEdit';

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
    cpuBaseLine: state.setting.cpuBaseLine,
    memoryBaseLine: state.setting.memoryBaseLine,
    loadBaseLine: state.setting.loadBaseLine,
    diskBaseLine: state.setting.diskBaseLine,
    networkBaseLine: state.setting.networkBaseLine,
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
  maxNum: number,
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
      maxNum: 0,
      endTimestamps,
      startTimestamps: endTimestamps - DETAIL_DEFAULT_RANGE,
      currentInstance:  'all',
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

  getData = async () => {
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
    this.setState({
      currentInstance: instance,
    }, this.updateChart);
    trackEvent(`${type}_detail`, 'select_data_type', `from_${type}_detail`);
  }

  handleMetricChange = async (metric) => {
    const { metricOptions, type, asyncUpdateBaseLine } = this.props;
    const metricOption = metricOptions.find(option => option.metric === metric);
    trackEvent(`${type}_detail`, 'select_metric_query', `from_${type}_detail`);
    await asyncUpdateBaseLine(`${type}BaseLine`, undefined);
    if (metricOption) {
      this.setState({
        currentMetricOption: metricOption
      }, this.getData);
    }
  }

  handleBaseLineChange= async (value) => {
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
    this.setState({
      maxNum: getMaxNum(data)
    });
    updateDetailChart(this.chartInstance, {
      type,
      tickInterval: getProperTickInterval(endTimestamps - startTimestamps),
    }).changeData(data);
    this.chartInstance.autoFit = true;
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
    const { maxNum, startTimestamps, endTimestamps, currentInstance, currentMetricOption } = this.state;
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
        <MachineDetail
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
          <LineChart 
            isDefaultScale={currentMetricOption.valueType === VALUE_TYPE.percentage} // VALUE_TYPE.percentage has a default Scale
            yAxisMaximum={maxNum} 
            tickInterval={getProperTickInterval(endTimestamps - startTimestamps)} 
            baseLine={baseLine} options={{ padding: [10, 70, 70, 70] }} 
            renderChart={this.renderChart} 
          />
        </MachineDetail>
        <Modal
          title="empty"
          className="machine-modal"
          width="550px"
          handlerRef={handler => (this.modalHandler = handler)}
          footer={null}
        >
          <BaseLineEdit
            valueType={currentMetricOption.valueType}
            baseLine={baseLine || 0}
            onClose={this.handleClose}
            onBaseLineChange={this.handleBaseLineChange}
          />
        </Modal>
      </Spin>
    );
  }
}

export default connect(mapState, mapDispatch)(Detail);