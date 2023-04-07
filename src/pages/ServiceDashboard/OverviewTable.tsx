import React, { useEffect, useRef, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import intl from 'react-intl-universal';

import { ServicePanelType } from './index';

import styles from './index.module.less';
import { BatchQueryItem, ServiceName } from '@/utils/interface';
import { connect } from 'react-redux';
import { getClusterPrefix, VALUE_TYPE } from '@/utils/promQL';
import { asyncBatchQueries } from '@/requests';
import { getAutoLatency, getProperByteDesc } from '@/utils/dashboard';
import EventBus from '@/utils/EventBus';

interface OverviewTableData {
  serviceName: string;
}

const metrics = [
  'context_switches_total',
  'cpu_seconds_total',
  'memory_bytes_gauge',
  'read_bytes_total',
  'write_bytes_total',
  'open_filedesc_gauge',
  'count',
]

const mapDispatch: any = (_dispatch: any) => ({
});

const mapState = (state: any) => ({
  serviceMetric: state.serviceMetric,
  ready: state.serviceMetric.ready,
  cluster: state.cluster.cluster
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  // resourceInfos: NodeResourceInfo[];
  // loading: boolean;
  serviceMap: ServicePanelType;
}

const CellWidth = 150;

const ShowedServices: string[] = [ServiceName.GRAPHD, ServiceName.METAD, ServiceName.STORAGED];

function OverviewTable(props: IProps) {

  const { serviceMap, serviceMetric, cluster } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [frequencyValue, setFrequencyValue] = useState<number>(0);
  const [dataSource, setDataSource] = useState<OverviewTableData[]>([]);
  const pollingTimerRef = useRef<any>(null);

  useEffect(() => {
    const changeListener = (data) => {
      const { value } = data.detail;
      setFrequencyValue(value);
    }
    const freshListener = () => { handleRefresh(); }
    EventBus.getInstance().on('serviceOverview_change', changeListener);

    EventBus.getInstance().on('serviceOverview_fresh', freshListener);

    return () => {
      EventBus.getInstance().off('serviceOverview_change', changeListener);
      EventBus.getInstance().off('serviceOverview_fresh', freshListener);
    }
  }, [cluster, serviceMap]);

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
    }
    if (frequencyValue > 0) {
      pollingData();
    }
  }, [frequencyValue])

  const handleRefresh = () => {
    asyncGetServiceOverviewData(true);
  }

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  const pollingData = () => {
    asyncGetServiceOverviewData(false);
    if (frequencyValue > 0) {
      pollingTimerRef.current = setInterval(() => {
        asyncGetServiceOverviewData(false);
      }, frequencyValue);
    }
  }

  const renderCell = (text: string, type: VALUE_TYPE = VALUE_TYPE.byte) => {
    if (!text) return <div className={`${styles.tableCell}`}>-</div>
    let showText: string = '';
    switch (type) {
      case VALUE_TYPE.number:
        showText = text;
        break;
      case VALUE_TYPE.percentage:
        showText = `${text}%`;
        break;
      case VALUE_TYPE.byte:
        showText = getProperByteDesc(parseInt(text)).desc;
        break;
      case VALUE_TYPE.latency:
        showText = getAutoLatency(parseInt(text));
        break;
      default:
        break;
    }
    return <div className={`${styles.tableCell}`}>{showText}</div>
  }

  useEffect(() => {
    if (cluster?.id) {
      asyncGetServiceOverviewData(true);
    }
  }, [cluster, serviceMap])

  const columns: TableColumnType<OverviewTableData>[] = [
    {
      title: intl.get('device.serviceResource.serviceName'),
      dataIndex: "serviceName",
      render: (text, _) => <div className={styles.tableCell}>{text || '-'}</div>,
    },
    {
      title: intl.get('device.serviceResource.context_switches_total'),
      dataIndex: "context_switches_total",
      render: (text, _) => renderCell(text, VALUE_TYPE.number),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.cpu_seconds_total'),
      dataIndex: "cpu_seconds_total",
      render: (text, _) => renderCell(text, VALUE_TYPE.percentage),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.memory_bytes_gauge'),
      dataIndex: "memory_bytes_gauge",
      render: (text, _) => renderCell(text),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.read_bytes_total'),
      dataIndex: "read_bytes_total",
      ellipsis: true,
      render: (text, _) => renderCell(text),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.write_bytes_total'),
      dataIndex: "write_bytes_total",
      ellipsis: true,
      render: (text, _) => renderCell(text),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.open_filedesc_gauge'),
      dataIndex: "open_filedesc_gauge",
      ellipsis: true,
      render: (text, _) => renderCell(text, VALUE_TYPE.number),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.process_count'),
      dataIndex: "count",
      ellipsis: true,
      render: (text, _) => {
        const isRunning = text === '1';
        return (
          <div className={`${styles.tableCell} ${isRunning ? styles.normal : styles.danger}`}>
          {isRunning ? intl.get('device.serviceResource.running') : intl.get('device.serviceResource.exit')}
          </div>
        )
      },
      width: CellWidth
    },
  ]

  const getQueries = () => {
    if (!cluster?.id) return [];
    const clusterSuffix1 = `{${getClusterPrefix()}="${cluster.id}"}`;
    const queries: BatchQueryItem[] = [];
    ShowedServices.forEach((service) => {
      metrics.forEach((metric) => {
        let query = `nebula_${service}_${metric}${clusterSuffix1} - 0`;
        if (metric === 'cpu_seconds_total') {
          query = `avg by (instanceName) (irate(nebula_${service}_${metric}${clusterSuffix1}[30s])) * 100`
        }
        queries.push({
          refId: `${service}$${metric}`,
          query,
        })
      })
    })
    return queries;
  }

  const asyncGetServiceOverviewData = async (shouldLoading?: boolean) => {
    if (!serviceMap[ServiceName.GRAPHD]) return;
    shouldLoading && setLoading(true);
    const queries = getQueries();
    const data: any = await asyncBatchQueries(queries);
    const { results } = data;
    const curDataSources: OverviewTableData[] = serviceMap[ServiceName.GRAPHD]
      .concat(serviceMap[ServiceName.METAD])
      .concat(serviceMap[ServiceName.STORAGED])
      .map(item => ({ serviceName: item }));
    Object.keys(results).forEach(refId => {
      const [_serviceType, metricName] = refId.split('$');
      const metricItems = results[refId].result;
      metricItems.forEach(({ metric, value }) => {
        const curItem = curDataSources.find(item => item.serviceName === metric.instanceName);
        if (curItem) {
          curItem[metricName] = value[1];
        } else {
          curDataSources.push({
            serviceName: metric.instanceName,
            [metricName]: value[1]
          })
        }
      })
    });
    setLoading(false);
    setDataSource(curDataSources);
  }

  return (
    <Table
      dataSource={dataSource}
      rowKey="serviceName"
      loading={loading}
      columns={columns}
      pagination={{
        hideOnSinglePage: true,
      }}
      className={styles.overviewTable}
    />
  );
}

export default connect(mapState, mapDispatch)(OverviewTable);
