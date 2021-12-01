import { Spin, Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { IDispatch, IRootState } from '@/store';
import { connect } from 'react-redux';
import PieChart from '@/components/Charts/PieChart';
import { Chart } from '@antv/g2';
import { groupBy, round, sum } from 'lodash';
import { renderPieChartTpl } from '@/utils/chart/chart';
import { DashboardSelect, Option } from '@/components/DashboardSelect';

import './index.less';


const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
    asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
    asyncGetParts: dispatch.nebula.asyncGetParts,
    updateSpace: space =>
      dispatch.nebula.update({
        currentSpace: space,
      }),
  };
};

const mapState = (state: IRootState) => ({
  spaces: state.nebula.spaces,
  loading: state.loading.models.nebula,
  currentSpace:state.nebula.currentSpace,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
    
}

interface IState {
  data: {
    name: string,
    count: number
  }[]
}

class PartitionDistribution extends React.Component<IProps, IState> {

  chartInstance: Chart;
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    await this.props.asyncGetSpaces();
    const { currentSpace } = this.props;
    if(currentSpace){
      await this.getParts();
    }
  }

  handleSpaceChange= async space => {
    const { code } = await this.props.asyncUseSpaces(space);
    if(code === 0) {
      await this.props.updateSpace(space);
      await this.getParts();
    }
  }

  getParts= async () => {
    const res = await this.props.asyncGetParts();
    const groupRes = groupBy(res, 'Leader');
    const data = Object.keys(groupRes).map(item => ({
      name: item,
      count: groupRes[item].length
    }));
    this.setState({ data }, this.updateChart);
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
      this.chartInstance.data(chartData)
        .render();
    }
  }


  render() {
    const { data } = this.state;
    const { loading } = this.props;
    const columns = [{
      title: intl.get('common.service'),
      dataIndex: 'name',
    }, {
      title: intl.get('service.partitionNum'),
      dataIndex: 'count',
    }];
    
    const { currentSpace, spaces } = this.props;
    return (
      <Spin delay={200} spinning={!!loading}>
        <div className="partition-distribution">
          <div className="common-header">
            <span>{currentSpace} Partition {intl.get('service.distribution')}</span>
            <div className="select-space">
              <span>{intl.get('service.spaces')}:</span>
              <DashboardSelect 
                placeholder={intl.get('service.chooseSpace')}
                value={currentSpace || undefined}
                onChange={this.handleSpaceChange}
                style={{
                  width: 220 
                }}>
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