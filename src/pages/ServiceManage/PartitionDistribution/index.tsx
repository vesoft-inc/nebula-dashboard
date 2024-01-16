import { useEffect, useMemo, useRef, useState } from 'react';
import { Empty, Spin, Table } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { round, sum } from 'lodash';
import { Chart } from '@antv/g2';
import classnames from 'classnames';
import { IDispatch, IRootState } from '@/store';
import PieChart from '@/components/Charts/PieChart';
import { renderPieChartTpl } from '@/utils/chart/chart';

import './index.less';
import { isCommunityVersion } from '@/utils';
import SelectSpace from '../SelectSpace';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  asyncGetParts: dispatch.nebula.asyncGetParts,
});

const mapState: any = (state: IRootState) => ({
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

function PartitionDistribution(props: IProps) {
  const chartInstance = useRef<Chart>();

  const { nebulaConnect, asyncGetParts,
    currentSpace, loading, isOverview } = props;
  const [data, setData] = useState<{
    name: string;
    count: number;
  }[]>([])

  useEffect(() => {
    updateChart();
  }, [data])

  useEffect(() => {
    if (isCommunityVersion() || nebulaConnect) {
      if (currentSpace) {
        getParts(currentSpace)
      }
    }
  }, [nebulaConnect, currentSpace])

  const getParts = async (space: string) => {
    const res = await asyncGetParts({
      space,
    });
    const groupRes = {};
    res.forEach(item => {
      item.Peers.split(', ').forEach(peers => {
        !groupRes[peers] ? (groupRes[peers] = 1) : groupRes[peers]++;
      });
    });

    const data = Object.keys(groupRes).map(item => ({
      name: item,
      count: groupRes[item],
    })).sort((a, b) => b.name < a.name ? 1 : -1);
    setData(data);
    // this.setState({ data }, this.updateChart);
  };

  const renderChart = (instance: Chart) => {
    chartInstance.current = instance;
    renderPieChartTpl(chartInstance.current);
  };

  const updateChart = () => {
    if (data.length > 0) {
      const total = sum(data.map(i => i.count));
      const chartData = data.map(item => ({
        type: item.name,
        value: round(item.count * 100 / total, 2),
      }));
      chartInstance.current?.tooltip({
        customItems: (items) => {
          return items.map((item) => {
            return { ...item, value: `${item.value}%` };
          })
        }
      })
      chartInstance.current?.data(chartData).render();
    }
  };

  const columns = useMemo(() => [
    {
      title: intl.get('common.service'),
      dataIndex: 'name',
    },
    {
      title: intl.get('service.partitionNum'),
      dataIndex: 'count',
    },
  ], []);

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
              {/* @ts-ignore */}
            <SelectSpace currentSpace={currentSpace} />
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
              renderChart={renderChart}
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


export default connect(mapState, mapDispatch)(PartitionDistribution);
