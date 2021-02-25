import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import LineChart from '@assets/components/Charts/LineChart';
import { IDispatch, IRootState } from '@assets/store';
import { CARD_POLLING_INTERVAL, DETAIL_DEFAULT_RANGE, getDataByType } from '@assets/utils/dashboard';
import { uniq } from 'lodash';

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
    this.chartInstance = chartInstance;
    this.chartInstance
      .axis('time', {
        label: {
          formatter: time => {
            return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      })
      .axis('value', {
        label: {
          formatter: percent => `${percent}%`
        }
      })
      .tooltip({
        customItems: items => {
          return [
            {
              ...items[0],
              value: items[0].value + '%'
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      })
      .legend({
        position: 'bottom',
      })
      .scale({
        value: {
          min: 0,
          max: 100,
          tickInterval: 25,
        }
      })
      .line()
      .position('time*value')
      .color('type');
  }

  updateChart = () => {
    const { cpuUsage } = this.props;
    const { currentType } = this.state;
    const data = getDataByType(cpuUsage, currentType);
    this.chartInstance
      .changeData(data);
    this.chartInstance.render();
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