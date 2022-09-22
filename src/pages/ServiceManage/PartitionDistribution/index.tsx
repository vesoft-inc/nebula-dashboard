import React from 'react';
import { Empty, Spin, Table } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { round, sum } from 'lodash';
import { Chart } from '@antv/g2';
import classnames from 'classnames';
import { IDispatch, IRootState } from '@/store';
import PieChart from '@/components/Charts/PieChart';
import { renderPieChartTpl } from '@/utils/chart/chart';
import { DashboardSelect, Option } from '@/components/DashboardSelect';

import './index.less';
import { isCommunityVersion } from '@/utils';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  asyncGetParts: dispatch.nebula.asyncGetParts,
});

const mapState = (state: IRootState) => ({
  spaces: state.nebula.spaces,
  loading: state.loading.models.nebula,
  currentSpace: state.nebula.currentSpace,
  nebulaConnect: state.nebula.nebulaConnect,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  isOverview: boolean;
}

interface IState {
  data: {
    name: string;
    count: number;
  }[];
}

class PartitionDistribution extends React.Component<IProps, IState> {
  chartInstance: Chart;

  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    const { nebulaConnect } = this.props;
    if (isCommunityVersion() || nebulaConnect) {
      await this.props.asyncGetSpaces();
      const { currentSpace } = this.props;
      if (currentSpace) {
        await this.getParts();
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { nebulaConnect, currentSpace } = this.props;
    if (nebulaConnect !== prevProps.nebulaConnect) {
      if (isCommunityVersion() || nebulaConnect) {
        await this.props.asyncGetSpaces();
        const { currentSpace } = this.props;
        if (currentSpace) {
          await this.getParts();
        }
      }
    }
    if (prevProps.currentSpace !== currentSpace) {
      if (currentSpace) {
        await this.getParts();
      }
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  handleSpaceChange = async space => {
    const { code } = await this.props.asyncUseSpaces(space);
    if (code === 0) {
      await this.getParts();
    }
  };

  getParts = async () => {
    const res = await this.props.asyncGetParts();
    const groupRes = {};
    res.forEach(item => {
      item.Peers.split(', ').forEach(peers => {
        !groupRes[peers] ? (groupRes[peers] = 1) : groupRes[peers]++;
      });
    });

    const data = Object.keys(groupRes).map(item => ({
      name: item,
      count: groupRes[item],
    }));
    this.setState({ data }, this.updateChart);
  };

  renderChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    renderPieChartTpl(chartInstance);
  };

  updateChart = () => {
    const { data } = this.state;
    if (data.length > 0) {
      const total = sum(data.map(i => i.count));
      const chartData = data.map(item => ({
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
        title: intl.get('service.partitionNum'),
        dataIndex: 'count',
      },
    ];

    const { isOverview, currentSpace, spaces } = this.props;
    return (
      <Spin delay={200} spinning={!!loading}>
        <div className="partition-distribution">
          {!isOverview && (
            <div className="common-header">
              <span>
                {currentSpace} Partition {intl.get('service.distribution')}
              </span>
              <div className="select-space">
                <span>{intl.get('service.spaces')}:</span>
                <DashboardSelect
                  placeholder={intl.get('service.chooseSpace')}
                  value={currentSpace || undefined}
                  onChange={this.handleSpaceChange}
                  style={{
                    width: 220,
                  }}
                >
                  {spaces.map((space: any) => (
                    <Option value={space.Name} key={space.Name}>
                      {space.Name}
                    </Option>
                  ))}
                </DashboardSelect>
              </div>
            </div>
          )}
          <div
            className={classnames('leader-content', {
              'leader-overview': isOverview,
            })}
          >
            {data.length > 0 ? (
              <PieChart
                options={
                  isOverview
                    ? { width: 350, height: 226 }
                    : { width: 500, height: 286 }
                }
                renderChart={this.renderChart}
              />
            ) : (
              <Empty
                className={classnames({ 'empty-overview': isOverview })}
                description={intl.get('common.noData')}
              />
            )}
            <Table
              className={classnames('leader-table', {
                'table-overview': isOverview,
              })}
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

export default connect(mapState, mapDispatch)(PartitionDistribution);
