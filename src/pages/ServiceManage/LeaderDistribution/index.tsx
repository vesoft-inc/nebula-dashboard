import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Spin, Table, message } from 'antd';
import intl from 'react-intl-universal';
import { IDispatch, IRootState } from '@/store';
import { Chart } from '@antv/g2';
import { renderPieChartTpl } from '@/utils/chart/chart';
import { connect } from 'react-redux';
import { last, round } from 'lodash';
import { compare } from 'compare-versions';
import Modal from '@/components/Modal';
import PieChart from '@/components/Charts/PieChart';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SelectSpace from '../SelectSpace';
import './index.less';
import { isCommunityVersion } from '@/utils';
import { DEFAULT_VERSION, formatVersion } from '@/utils/dashboard';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetHostsInfo: dispatch.nebula.asyncGetHostsInfo,
  asyncExecNGQL: dispatch.nebula.asyncExecNGQL,
});

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetHostsInfo,
  nebulaConnect: (state.nebula as any).nebulaConnect,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  isOverview?: boolean;
  baseRouter?: string;
}

interface IChaerData {
  name: string;
  count: number;
}

const LeaderDistribution: React.FC<IProps> = (props: IProps) => {
  const modalHandler = useRef<any>();
  const [data, setData] = useState<IChaerData[]>([]);
  const [chartInstance, setChartInstance] = useState<Chart>();

  const { nebulaConnect, cluster = {}, loading, isOverview, baseRouter = '/management' } = props;

  useEffect(() => {
    if (isCommunityVersion() || nebulaConnect) {
      getStorageInfo();
    }
    return () => setData([]);
  }, [nebulaConnect]);

  useEffect(() => {
    if (chartInstance) {
      updateChart();
    }
  }, [data, chartInstance]);

  const getStorageInfo = async () => {
    const res = await props.asyncGetHostsInfo();
    const data = res.map((item: any) => ({
      name: item.Host,
      count: item['Leader count'],
      distribution: item['Leader distribution'],
    }));
    setData(data);
  };

  const renderChart = (_chartInstance: Chart) => {
    setChartInstance(_chartInstance);
    renderPieChartTpl(_chartInstance);
  };

  const updateChart = () => {
    if (data.length > 0) {
      const lastItem = last(data);
      const total = lastItem!.count;
      const hostList =
        lastItem!.name === 'Total' ? data.slice(0, data.length - 1) : data;
      const chartData = hostList.map(item => ({
        type: item.name,
        value: total ? round(item.count / total, 2) : 1,
      }));
      chartInstance?.data(chartData).render();
    }
  };

  const handleBalance = async () => {
    let code = -1;
    if (compare(formatVersion(cluster?.version || DEFAULT_VERSION), 'v3.0.0', '<')) {
      code = await props.asyncExecNGQL('BALANCE LEADER');
      if (code === 0) {
        message.success(intl.get('common.succeed'));
        getStorageInfo();
      }
    } else {
      modalHandler.current?.show();
    }
  };

  const handleHide = async () => {
    modalHandler.current?.hide();
    const code = await props.asyncExecNGQL('SUBMIT JOB BALANCE LEADER');
    if (code === 0) {
      message.success(intl.get('common.succeed'));
      getStorageInfo();
    }
  };

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
      render: distribution => (
        <div className="distribution-table">{distribution}</div>
      ),
    },
  ];

  const options = useMemo(
    () =>
      isOverview ? { width: 350, height: 226 } : { width: 500, height: 286 },
    [isOverview],
  );

  return (
    <Spin delay={200} spinning={!!loading}>
      <div className="leader-distribution">
        <div
          className={classnames('common-header', {
            'overview-header': isOverview,
          })}
        >
          <span>Storage Leader {intl.get('service.distribution')}</span>
          {isOverview && (
            <Link to={`${baseRouter}/leader-distribution`}>
              {intl.get('common.detail')}
            </Link>
          )}
          <Button
            type="primary"
            ghost
            onClick={handleBalance}
            disabled={isCommunityVersion() ? false : !cluster?.id}
          >
            Balance Leader
          </Button>
        </div>
        <div
          className={classnames('leader-content', {
            'content-overview': isOverview,
          })}
        >
          {data.length > 0 ? (
            <PieChart options={options} renderChart={renderChart} />
          ) : (
            <Empty description={intl.get('common.noData')} />
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
      <Modal
        title={intl.get('service.chooseSpace')}
        handlerRef={handler => (modalHandler.current = handler)}
        footer={null}
      >
        {/* @ts-ignore */}
        <SelectSpace onHide={handleHide} />
      </Modal>
    </Spin>
  );
};
export default connect(mapState, mapDispatch)(LeaderDistribution);
