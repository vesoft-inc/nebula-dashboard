import { Select, Spin } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import LineChart from '@assets/components/Charts/LineChart';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import { IStatRangeItem } from '@assets/utils/interface';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import { LINE_COLORS } from '@assets/utils/service';
import './index.less';

const { Option } = Select;

interface IState {
  serviceType: string,
  metricType: string,
  data: {
    name: string,
    time: number,
    value: number
  }[]
}

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetGraphQPS: dispatch.service.asyncGetGraphQPS,
  };
};

const mapState = (state: IRootState) => {
  return {
    graphMetric: state.service.graphMetric,
    loading: state.loading.models.service
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {}

class ServerMetrics extends React.Component<IProps, IState> {
  chartInstance: Chart;
  pollingTimer: any;
  constructor (props: IProps) {
    super(props);
    this.state = {
      serviceType: 'Graph',
      metricType: 'QPS',
      data: []
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

  pollingData = () => {
    this.getQPSMetric();
    // TODO define query interval
    this.pollingTimer = setTimeout(this.pollingData, 10000);
  }

  handleChangeSearchType = (type, value) => {
    this.setState({
      [type]: value
    } as Pick<IState, keyof IState>);
  }

  getQPSMetric = async () => {
    const end = Math.round(Date.now() / 1000);
    // TODO define metric query interval
    const res = await this.props.asyncGetGraphQPS({
      end,
      start: end - 10 * 60,
      step: 60
    });
    const data = res.map((item: IStatRangeItem) => {
      const name = item.metric.instanceName;
      return item.values.map(v => {
        return {
          name,
          time: v[0],
          value: Number((v[1] / 60).toFixed(2))
        };
      });
    }).flat();
    this.setState({ data }, this.updateChart);
  }

  renderLineChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    this.chartInstance.axis('time', {
      label: {
        formatter: (val) => {
          return dayjs(Number(val) * 1000).format('HH:mm');
        }
      }
    });
    this.chartInstance
      .line()
      .position('time*value')
      .color('name', LINE_COLORS);
    this.chartInstance
      .scale('time', {
        type: 'linear',
      })
      .scale('value', {
        nice: true,
      })
      .tooltip({
        showCrosshairs: true,
        shared: true,
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      });
      
    this.chartInstance.legend({
      position: 'bottom',
    });
  }
  updateChart = () => {
    const { data } = this.state;
    this.chartInstance.changeData(data);
  }
  
  render () {
    const { serviceType, metricType } = this.state;
    const { loading } = this.props;
    return (<div className="server-metrics">
      <div className="common-header">
        <span>{serviceType} {intl.get('common.service')}: {metricType} {intl.get('common.metric')}</span>
        <div className="service-select">
          <div className="select-item">
            <span>{intl.get('common.service')}:</span>
            <Select value={serviceType} onChange={value => this.handleChangeSearchType('serviceType', value)}>
              <Option value="Graph">Graph</Option>
              <Option value="Storage">Storage</Option>
              <Option value="Meta">Meta</Option>
            </Select>
          </div>
          <div className="select-item">
            <span>{intl.get('common.metric')}:</span>
            <Select value={metricType} onChange={value => this.handleChangeSearchType('metricType', value)}>
              <Option value="QPS">QPS</Option>
              <Option value="Latency">Latency</Option>
              <Option value="Error">Error</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="container">
        {/* <div className="btns">
          <Select defaultValue="line">
            <Option value="line">{intl.get('common.lineChart')}</Option>
            <Option value="bar">{intl.get('common.barChart')}</Option>
          </Select>
        </div> */}
        <Spin delay={200} spinning={!!loading}>
          <div className="chart">
            <LineChart options={{ height: 500, padding: [50,50,50,50] }} renderChart={this.renderLineChart} />
          </div>
        </Spin>
      </div>
    </div>);
  }
}
export default connect(mapState, mapDispatch)(ServerMetrics);