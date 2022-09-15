import { Spin, Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { groupBy, round } from 'lodash';
import { Chart } from '@antv/g2';
import { IRootState } from '@/store';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PieChart from '@/components/Charts/PieChart';
import { IVersionItem, NebulaVersionType } from '@/utils/interface';
import { renderPieChartTpl } from '@/utils/chart/chart';
import ServiceHeader from '@/components/Service/ServiceHeader';

import './index.less';
import { getNebulaVersionName } from '@/utils';

const VERSION_REGEX = /[1-9]+\.[0-9]+\.[0-9](-ent)?$/;

interface IProps extends ReturnType<typeof mapState> {
  title: string;
  icon: string;
  data: IVersionItem[];
  isOverview: boolean;
}

interface IState {}

const mapState = (state: IRootState) => ({
  loading: state.loading.models.service,
});

class VersionItem extends React.PureComponent<IProps, IState> {
  chartInstance: Chart;

  componentDidUpdate() {
    if (!this.props.isOverview) {
      this.updateChart();
    }
  }

  renderChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    renderPieChartTpl(chartInstance);
  };

  // HAKC: Compatible processing version data
  renderVersion = (key: string) => {
    if (!key.includes('Build Time')) {
      if (VERSION_REGEX.test(key)) {
        if (key?.includes('ent')) {
          return getNebulaVersionName(
            NebulaVersionType.ENTERPRISE,
            key.split('-')[0],
          );
        }
        return getNebulaVersionName(NebulaVersionType.COMMUNITY, key);
      }
      return key;
    }
    return key.split(',')[0];
  };

  updateChart = () => {
    const { data } = this.props;
    const versionList = groupBy(data, 'version');
    const chartData = Object.keys(versionList).map(key => ({
      type: this.renderVersion(key),
      value: round(versionList[key].length / data.length, 2),
    }));
    this.chartInstance.data(chartData).render();
  };

  render() {
    const { title, icon, data, isOverview, loading } = this.props;
    const columns = [
      {
        title: intl.get('common.service'),
        dataIndex: 'name',
      },
      {
        title: intl.get('common.version'),
        dataIndex: 'version',
        render: version => this.renderVersion(version),
      },
    ];
    return (
      <Spin delay={200} spinning={!!loading}>
        <div
          className={classnames('version-statistic-item', {
            'version-statistic-overview': isOverview,
          })}
        >
          <ServiceHeader title={title} icon={!isOverview ? icon : undefined} />
          <div
            className={classnames('version-content', {
              'version-overview': isOverview,
            })}
          >
            {!isOverview && (
              <PieChart
                options={{ height: 200 }}
                renderChart={this.renderChart}
              />
            )}
            <Table
              className={classnames({ 'service-table': !isOverview })}
              columns={columns}
              dataSource={data}
              bordered
              pagination={false}
              size="small"
              rowKey="name"
            />
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(mapState)(VersionItem);
