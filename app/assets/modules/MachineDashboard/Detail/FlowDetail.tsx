import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import LineChart from '@assets/components/Charts/LineChart';
import { IDispatch, IRootState } from '@assets/store';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getAdaptiveFlowValue, getDataByType, getProperTickInterval } from '@assets/utils/dashboard';
import { uniq } from 'lodash';
import { LINE_CHART_COLORS } from '@assets/utils/chart';

const mapState = (state: IRootState) => {
  const { receiveFlow, transmitFlow } = state.machine;

  if (receiveFlow.length && !receiveFlow[0].metric.instance.includes('-down')) {
    receiveFlow.forEach(instance => {
      instance.metric.instance = `${instance.metric.instance}-down`;
    });
  }
  if (transmitFlow.length && !transmitFlow[0].metric.instance.includes('-up')) {
    transmitFlow.forEach(instance => {
      instance.metric.instance = `${instance.metric.instance}-up`;
    });
  }

  return {
    receiveFlow,
    transmitFlow,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetFlowByRange: dispatch.machine.asyncGetFlowByRange,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
}

interface IState {
  currentInterval: number,
  currentType: string,
}
class FlowDetail extends React.Component<IProps, IState> {
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
    await this.props.asyncGetFlowByRange({
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
    this.chartInstance
      .axis('time', {
        label: {
          formatter: time => {
            return dayjs(Number(time) * 1000).format('HH:mm');
          }
        },
        grid: {
          line: {
            type: 'line',
            style: {
              fill: '#d9d9d9',
              opacity: 0.5,
            }
          }
        }
      })
      .axis('value', {
        label: {
          formatter: bps => {
            const { value, unit } = getAdaptiveFlowValue(bps);
            return `${value}${unit}`;
          }
        }
      })
      .legend({
        position: 'bottom'
      })
      .tooltip({
        customItems: items => {
          const [ { value: bytes }] = items;
          const { value, unit } = getAdaptiveFlowValue(bytes);
          return [
            {
              ...items[0],
              value: `${value} ${unit}`,
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      })
      .scale({
        time: {
          tickInterval: getProperTickInterval(currentInterval),
        }
      })
      .line()
      .position('time*value')
      .color('type', LINE_CHART_COLORS)
      .shape('smooth');
  }

  updateChart = () => {
    const { receiveFlow, transmitFlow } = this.props;
    const { currentType, currentInterval } = this.state;
    const _receiveFlow = getDataByType(receiveFlow, currentType);
    const _transmitFlow = getDataByType(transmitFlow, currentType);
    if (currentType === 'average') {
      _receiveFlow.map(instance => {
        instance.type = 'average-down';
        return instance;
      });
      _transmitFlow.map(instance => {
        instance.type = 'average-up';
        return instance;
      });
    }
    this.chartInstance.scale({
      time: {
        tickInterval: getProperTickInterval(currentInterval),
      }
    });
    this.chartInstance
      .changeData([..._receiveFlow, ..._transmitFlow]);
  }
  
  render () {
    const { currentInterval, currentType } = this.state;
    const { receiveFlow, transmitFlow } = this.props;
    const instances = uniq([...receiveFlow, ...transmitFlow].map(instance => instance.metric.instance));

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
      className="flow-detail"
      title={intl.get('device.detail.flow')}
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

export default connect(mapState, mapDispatch)(FlowDetail);