import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';
import { IDispatch, IRootState } from '@assets/store';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getDataByType, getProperTickInterval } from '@assets/utils/dashboard';
import { uniq } from 'lodash';
import { configDetailChart, updateDetailChart } from '@assets/utils/chart';

const mapState = (state: IRootState) => {
  return {
    cpuUsage: state.machine.cpuUsage,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetCPUUsageRateByRange: dispatch.machine.asyncGetCPUUsageRateByRange,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
}

interface IState {
  currentInterval: number,
  currentType: string,
}
class CPUDetail extends React.Component<IProps, IState> {
  pollingTimer: any;
  chartInstance: Chart;

  constructor (props: IProps) {
    super(props);
    this.state = {
      currentInterval: DETAIL_DEFAULT_RANGE,
      currentType: localStorage.getItem('detailType') || 'all',
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
    const { currentInterval } = this.state;
    const end = Math.round(Date.now() / 1000);
    const start = end - currentInterval;
    await this.props.asyncGetCPUUsageRateByRange({
      start,
      end,
    });
    this.updateChart();
  }

  pollingData = () => {
    this.getData();
    this.pollingTimer = setTimeout(this.pollingData, CARD_POLLING_INTERVAL);
  }

  handleIntervalChange = (interval) => {
    this.setState({
      currentInterval: interval 
    }, this.getData);
  }

  handleTypeChange = (type) => {
    localStorage.setItem('detailType', type);
    this.setState({
      currentType: type,
    }, this.updateChart);
  }

  renderChart = (chartInstance: Chart) => {
    const { currentInterval } = this.state;
    this.chartInstance = chartInstance;
    configDetailChart(chartInstance, {
      type: 'cpu',
      tickInterval: getProperTickInterval(currentInterval),
      isPercentValue: true,
    });
  }

  updateChart = () => {
    const { cpuUsage } = this.props;
    const { currentType, currentInterval } = this.state;
    const data = getDataByType(cpuUsage, currentType);
    updateDetailChart(this.chartInstance, {
      type: 'cpu',
      tickInterval: getProperTickInterval(currentInterval),
    }).changeData(data);
  }
  
  render () {
    const { currentInterval, currentType } = this.state;
    const { cpuUsage } = this.props;
    const instances = uniq(cpuUsage.map(instance => instance.metric.instance));

    const typeOptions = [
      {
        name: intl.get('device.detail.all'),
        value: 'all',
      },
      {
        name: intl.get('device.detail.average'),
        value: 'average',
      },
      ...instances.map(instance => ({
        name: instance,
        value: instance,
      }))
    ];

    return <DashboardDetail
      className="cpu-detail"
      title={intl.get('device.detail.cpu')}
      onIntervalChange={this.handleIntervalChange}
      interval={currentInterval}
      typeOptions={typeOptions}
      currentType={currentType}
      onTypeChange={this.handleTypeChange}
    >
      <LineChart options={{ padding: [10, 70, 70, 70] }} renderChart={this.renderChart} />
    </DashboardDetail>;
  }
}

export default connect(mapState, mapDispatch)(CPUDetail);