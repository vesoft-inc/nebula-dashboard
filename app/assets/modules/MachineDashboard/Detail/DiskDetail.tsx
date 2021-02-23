import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import LineChart from '@assets/components/Charts/LineChart';
import { IDispatch, IRootState } from '@assets/store';
import { CARD_POLLING_INTERVAL, DETAIL_COLORS, DETAIL_DEFAULT_RANGE, getDataByType, getMemoryProperSize } from '@assets/utils/dashboard';
import { sum, uniq } from 'lodash';

const mapState = (state: IRootState) => {
  const { diskUsageRate, diskSizeStat } = state.machine;
  const diskSizes = diskSizeStat.reduce((res, cur) => {
    res[cur.metric.instance] = Number(cur.value[1]);

    return res;
  }, {});

  return {
    diskUsageRate,
    diskSizes,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDiskUsageRateByRange: dispatch.machine.asyncGetDiskUsageRateByRange,
  asyncGetDiskSizeStat: dispatch.machine.asyncGetDiskSizeStat,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
}

interface IState {
  currentInterval: number,
  currentType: string,
}
class DiskDetail extends React.Component<IProps, IState> {
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
    this.props.asyncGetDiskSizeStat();
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
    await this.props.asyncGetDiskUsageRateByRange({
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
      .legend({
        position: 'bottom',
      })
      .tooltip({
        customItems: items => {
          const { diskSizes } = this.props;
          const [ { data: { type }, value }] = items;
          let size = 0;
          if (type === 'average') {
            const values = Object.values(diskSizes);
            size = sum(values) / values.length;
          } else {
            size = diskSizes[type];
          }
          const used = getMemoryProperSize(size * Number(value) / 100);
          const capacity = getMemoryProperSize(size);
          return [
            {
              ...items[0],
              value: Number(value).toFixed(2) + '%' + ` (${used}/${capacity})`,
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
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
    this.chartInstance
      .area()
      .style({
        fill: `l(90) 0:${DETAIL_COLORS.SOLID} 1:${DETAIL_COLORS.TRANSPARENT}`, 
      })
      .adjust('stack')
      .position('time*value')
      .color('type')
      .size(1);
  }

  updateChart = () => {
    const { diskUsageRate } = this.props;
    const { currentType } = this.state;
    const data = getDataByType(diskUsageRate, currentType);
    this.chartInstance
      .changeData(data);
    this.chartInstance.render();
  }
  
  render () {
    const { currentInterval, currentType } = this.state;
    const { diskUsageRate } = this.props;
    const instances = uniq(diskUsageRate.map(instance => instance.metric.instance));

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
      className="disk-detail"
      title={intl.get('device.detail.disk')}
      onIntervalChange={this.handleIntervalChange}
      interval={currentInterval}
      typeOptions={typeOptions}
      currentType={currentType}
      onTypeChange={this.handleTypeChange}
    >
      <LineChart options={{ padding: [10, 70, 70, 70]}} renderChart={this.renderChart} />
    </DashboardDetail>;
  }
}

export default connect(mapState, mapDispatch)(DiskDetail);