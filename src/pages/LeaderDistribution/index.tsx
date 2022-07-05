import { Spin, Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import { connect } from 'react-redux';
import { last, round } from 'lodash';
import { IDispatch, IRootState } from '@/store';
import { renderPieChartTpl } from '@/utils/chart/chart';
import PieChart from '@/components/Charts/PieChart';
import './index.less';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetHostsInfo: dispatch.nebula.asyncGetHostsInfo,
});

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetHostsInfo,
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {}

interface IState {
  data: {
    name: string;
    count: number;
    distribution: string;
  }[];
}

class LeaderDistribution extends React.Component<IProps, IState> {
  chartInstance: Chart;

  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getStorageInfo();
  }

  getStorageInfo = async () => {
    const res = await this.props.asyncGetHostsInfo();
    const data = res.map((item: any) => ({
      name: item.Host,
      count: item['Leader count'],
      distribution: item['Leader distribution'],
    }));
    this.setState(
      {
        data,
      },
      this.updateChart,
    );
  };

  renderChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    renderPieChartTpl(chartInstance);
  };

  updateChart = () => {
    const { data } = this.state;
    if (data.length > 0) {
      const total = last(data)!.count;
      const chartData = data.slice(0, data.length - 1).map(item => ({
        type: item.name,
        value: round(item.count / total, 2),
      }));
      this.chartInstance.data(chartData).render();
    }
  };

  render() {
    const { data } = this.state;
    const { loading } = this.props;
    const columns = [
      {
        title: intl.get('common.service'),
        dataIndex: 'name',
      },
      {
        title: intl.get('service.leaderNumber'),
        dataIndex: 'count',
      },
      {
        title: intl.get('service.leaderDistribute'),
        dataIndex: 'distribution',
      },
    ];
    return (
      <Spin delay={200} spinning={!!loading}>
        <div className="leader-distribution">
          <div className="common-header">
            <span>Storage Leader {intl.get('service.distribution')}</span>
          </div>
          <div className="leader-content">
            <PieChart
              options={{ height: 286 }}
              renderChart={this.renderChart}
            />
            <Table
              className="leader-table"
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey="name"
            />
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(mapState, mapDispatch)(LeaderDistribution);
