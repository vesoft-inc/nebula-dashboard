import { Spin, Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import PieChart from '@assets/components/Charts/PieChart';
import { Chart } from '@antv/g2';
import { groupBy, round, sum } from 'lodash';
import { renderPieChartTpl } from '@assets/utils/chart/chart';
import { DashboardSelect, Option } from '@assets/components/DashboardSelect';

import './index.less';


const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
    asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
    asyncGetParts: dispatch.nebula.asyncGetParts,
  };
};

const mapState = (state: IRootState) => ({
  spaces: state.nebula.spaces,
  loading: state.loading.models.nebula,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
    
}

interface IState {
  currentSpace: string,
  data: {
    name: string,
    count: number
  }[]
}

class PartitionDistribution extends React.Component<IProps, IState> {

  chartInstance: Chart;
  constructor (props: IProps) {
    super(props);
    this.state = {
      currentSpace: '',
      data: []
    };
  }

  componentDidMount () {
    this.getSpaces();
  }
  getSpaces = async () => {
    await this.props.asyncGetSpaces();
    const { spaces } = this.props;
    const currentSpace = (spaces[0] as any).Name;
    this.handleSpaceChange(currentSpace);
  }

  handleSpaceChange= async space => {
    const { code } = await this.props.asyncUseSpaces(space);
    if(code === 0) {
      this.setState({
        currentSpace: space
      });
      const res = await this.props.asyncGetParts();
      const groupRes = groupBy(res, 'Leader');
      const data = Object.keys(groupRes).map(item => ({
        name: item,
        count: groupRes[item].length
      }));
      this.setState({ data }, this.updateChart);
    }
  }

  renderChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    renderPieChartTpl(chartInstance);
  }

  updateChart = () => {
    const { data } = this.state;
    if(data.length > 0) {
      const total = sum(data.map(i => i.count));
      const chartData = data.map(item => ({
        type: item.name,
        value: round(item.count / total, 2)
      }));
      this.chartInstance.changeData(chartData);
    }
  }


  render () {
    const { data } = this.state;
    const { loading } = this.props;
    const columns = [{
      title: intl.get('common.service'),
      dataIndex: 'name',
    }, {
      title: intl.get('service.partitionNum'),
      dataIndex: 'count',
    }];
    
    const { spaces } = this.props;
    const { currentSpace } = this.state;
    return (
      <Spin delay={200} spinning={!!loading}>
        <div className="partition-distribution">
          <div className="common-header">
            <span>{currentSpace} Partition {intl.get('service.distribution')}</span>
            <div className="select-space">
              <span>Space:</span>
              <DashboardSelect value={currentSpace} onChange={this.handleSpaceChange}>
                {spaces.map((space:any) => {
                  return <Option value={space.Name} key={space.Name}>{space.Name}</Option>;
                })}
              </DashboardSelect>
            </div>
          </div>
          <div className="leader-content">
            <PieChart options={{ height: 286 }} renderChart={this.renderChart} />
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

export default connect(mapState, mapDispatch)(PartitionDistribution);