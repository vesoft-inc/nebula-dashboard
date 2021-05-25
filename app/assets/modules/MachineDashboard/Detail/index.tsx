import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getDataByType, getProperTickInterval } from '@assets/utils/dashboard';
import { uniq } from 'lodash';
import { configDetailChart, updateDetailChart } from '@assets/utils/chart/chart';
import { IStatRangeItem } from '@assets/utils/interface';
import { Spin } from 'antd';
import { IRootState } from '@assets/store';
import { connect } from 'react-redux';
import './index.less';
import { SUPPORT_METRICS, VALUE_TYPE } from '@assets/utils/promQL';


const mapState = (state: IRootState) => {
  return {
    aliasConfig: state.app.aliasConfig
  };
};
interface IProps extends ReturnType<typeof mapState>{
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

  constructor (props: IProps) {
    super(props);
    const endTimestamps = Date.now();
    this.state = {
      endTimestamps,
      startTimestamps: endTimestamps - DETAIL_DEFAULT_RANGE,
      currentInstance: localStorage.getItem('detailType') || 'all',
      currentMetricOption: props.metricOptions[0],
    };
  }

  componentDidMount () {
    this.pollingData();
  }

  componentWillUnmount () {
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
    this.setState({
      startTimestamps,
      endTimestamps
    }, this.getData);
  }

  handleInstanceChange = (instance) => {
    localStorage.setItem('detailType', instance);
    this.setState({
      currentInstance: instance,
    }, this.updateChart);
  }

  handleMetricChange = (metric) => {
    const { metricOptions } = this.props;
    const metricOption = metricOptions.find(option => option.metric === metric);
    if (metricOption) {
      this.setState({
        currentMetricOption: metricOption
      }, this.getData);
    }
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
  
  render () {
    const { startTimestamps, endTimestamps, currentInstance, currentMetricOption } = this.state;
    const { dataSource, metricOptions, loading, aliasConfig } = this.props;
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
        >
          <LineChart options={{ padding: [10, 70, 70, 70] }} renderChart={this.renderChart} />
        </DashboardDetail>
      </Spin>
    );
  }
}

export default connect(mapState)(Detail);