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
  const { memoryUsageRate, memorySizeStat } = state.machine;
  const memorySizes = memorySizeStat.reduce((res, cur) => {
    res[cur.metric.instance] = Number(cur.value[1]);

    return res;
  }, {});

  return {
    memoryUsageRate,
    memorySizes,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetMemoryUsageRateByRange: dispatch.machine.asyncGetMemoryUsageRateByRange,
  asyncGetMemorySizeStat: dispatch.machine.asyncGetMemorySizeStat,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
}

interface IState {
  currentInterval: number,
  currentType: string,
}
class MemoryDetail extends React.Component<IProps, IState> {
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
    this.props.asyncGetMemorySizeStat();
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
    await this.props.asyncGetMemoryUsageRateByRange({
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
    this.chartInstance = chartInstance;
    const { memorySizes } = this.props;
    const { currentInterval } = this.state;
    configDetailChart(chartInstance, {
      type: 'memory',
      tickInterval: getProperTickInterval(currentInterval),
      isPercentValue: true,
      statSizes: memorySizes,
    });
  }

  updateChart = () => {
    const { memoryUsageRate } = this.props;
    const { currentType, currentInterval } = this.state;
    const data = getDataByType(memoryUsageRate, currentType);
    updateDetailChart(this.chartInstance, {
      type: 'memory',
      tickInterval: getProperTickInterval(currentInterval),
    }).changeData(data);
    this.chartInstance.render();
  }
  
  render () {
    const { currentInterval, currentType } = this.state;
    const { memoryUsageRate } = this.props;
    const instances = uniq(memoryUsageRate.map(instance => instance.metric.instance));

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
      className="memory-detail"
      title={intl.get('device.detail.memory')}
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

export default connect(mapState, mapDispatch)(MemoryDetail);