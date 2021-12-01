import { Spin, Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import PieChart from '@/components/Charts/PieChart';
import { IVersionItem } from '@/utils/interface';
import { groupBy, round } from 'lodash';
import { Chart } from '@antv/g2';
import { renderPieChartTpl } from '@/utils/chart/chart';
import { IRootState } from '@/store';
import { connect } from 'react-redux';
import ServiceHeader from '@/components/Service/ServiceHeader';
import './index.less';

interface IProps extends ReturnType<typeof mapState>{
  title: string;
  icon: string;
  data: IVersionItem[]
}

interface IState {
}

const mapState = (state: IRootState) => {
  return {
    loading: state.loading.models.service
  };
};


class VersionItem extends React.PureComponent<IProps, IState> {
  chartInstance: Chart;
  componentDidUpdate() {
    this.updateChart();
  }

  renderChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    renderPieChartTpl(chartInstance);
  }

  updateChart = () => {
    const { data } = this.props;
    const versionList = groupBy(data, 'version');
    const chartData = Object.keys(versionList).map(key => {
      return {
        type: key,
        value: round(versionList[key].length / data.length, 2)
      };
    });
    this.chartInstance.data(chartData).render();
  }

  render() {
    const { title, icon, data, loading } = this.props;
    const columns = [{
      title: intl.get('common.service'),
      dataIndex: 'name',
    }, {
      title: intl.get('common.version'),
      dataIndex: 'version',
    }];
    return (
      <Spin delay={200} spinning={!!loading}>
        <div className="version-statistic-item">
          <ServiceHeader title={title} icon={icon} />
          <div className="version-content">
            <PieChart options={{ height: 200 }} renderChart={this.renderChart} />
            <Table
              className="service-table"
              columns={columns} 
              dataSource={data} 
              bordered={true}
              pagination={false}
              size={'small'}
              rowKey="name"
            />
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(mapState)(VersionItem);