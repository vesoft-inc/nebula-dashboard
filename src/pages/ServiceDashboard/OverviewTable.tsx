import React, { useEffect, useRef, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import intl from 'react-intl-universal';

import { ServicePanelType } from './index';

import styles from './index.module.less';
import { BatchQueryItem, CellHealtyLevel, ServiceName } from '@/utils/interface';
import { connect } from 'react-redux';
import { getClusterPrefix, VALUE_TYPE } from '@/utils/promQL';
import { asyncBatchQueries } from '@/requests';
import { getAutoLatency, getProperByteDesc } from '@/utils/dashboard';
import EventBus from '@/utils/EventBus';
import { calcNodeHealty } from '@/utils';

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

const Percent_Range = {
  [CellHealtyLevel.normal]: [0, 40],
  [CellHealtyLevel.warning]: [40, 80],
  [CellHealtyLevel.danger]: [80, 100],
}

const ShowedServices: string[] = [ServiceName.GRAPHD, ServiceName.METAD, ServiceName.STORAGED];

function OverviewTable(props: IProps) {

  const { serviceMap, cluster } = props;
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

  const renderCell = (text: string, type: VALUE_TYPE = VALUE_TYPE.byte, shouldCalcNodeHealty: boolean = false) => {
    if (!text) return <div className={`${styles.tableCell}`}>-</div>
    let showText: string = '';
    switch (type) {
      case VALUE_TYPE.number:
        showText = text;
        break;
      case VALUE_TYPE.percentage:
        showText = `${parseFloat(text).toFixed(2)}%`;
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
    let level: CellHealtyLevel = CellHealtyLevel.normal ;
    if (showText?.includes('%')) {
      const num = parseFloat(text.slice(0, text.length - 1));
      level = calcNodeHealty(num);
    }
    return <div className={`${styles.tableCell} ${shouldCalcNodeHealty ? styles[level] : undefined}`}>{showText}</div>
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
      width: 110
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
      width: 110
    },
    {
      title: intl.get('device.serviceResource.cpu_seconds_total'),
      dataIndex: "cpu_seconds_total",
      render: (text, _) => renderCell(text, VALUE_TYPE.percentage, true),
      width: CellWidth
    },
    {
      title: intl.get('device.serviceResource.memory_bytes_gauge'),
      dataIndex: "memory_bytes_gauge",
      render: (text, record) => {
        const value = getProperByteDesc(parseInt(text)).desc;
        const percent = (parseInt(text) / parseInt(record['memory_total']) as any).toFixed(3) * 100;
        const level: CellHealtyLevel = calcNodeHealty(percent, Percent_Range);
        return (
          <div className={`${styles.tableCell} ${styles[level]}`}>{value} ({percent}%)</div>
        );
      },
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
          query = `avg by (instanceName) (rate(nebula_${service}_${metric}${clusterSuffix1}[5m])) * 100`
        }
        queries.push({
          refId: `${service}$${metric}`,
          query,
        })
      })
    })
    return queries;
  }

  const getMachineQueries = (servicNames: string[]) => {
    const hosts: string[] = [...new Set(servicNames
      .map((service) => service.split('-')[0]))];
    const clusterSuffix1 = cluster ? `,${getClusterPrefix()}="${cluster.id}"` : '';
    const queries: BatchQueryItem[] = hosts.map(host => {
      const instanceSuffix = `instance=~"^${host.replaceAll(".", "\.")}.*"`;
      return (
        {
          refId: `node$${host}$memory_total`,
          query: `node_memory_MemTotal_bytes{${instanceSuffix}${clusterSuffix1}}`
        }
      )
    })
    return queries;
  }

  const asyncGetServiceOverviewData = async (shouldLoading?: boolean) => {
    if (!serviceMap[ServiceName.GRAPHD]) return;
    shouldLoading && setLoading(true);
    const curDataSources: OverviewTableData[] = serviceMap[ServiceName.GRAPHD]
      .concat(serviceMap[ServiceName.METAD])
      .concat(serviceMap[ServiceName.STORAGED])
      .map(item => ({ serviceName: item }));
    const machineInfoQueries: BatchQueryItem[] = getMachineQueries(curDataSources.map(item => item.serviceName))
    const queries = getQueries();
    const data: any = await asyncBatchQueries(queries.concat(machineInfoQueries));
    const { results } = data;
    Object.keys(results).forEach(refId => {
      if (refId.startsWith('node$')) {
        const [_, machineHost, metricName] = refId.split('$');
        const metricItems = results[refId].result;
        metricItems.forEach(({ metric, value }) => {
          const curItems = curDataSources.filter(item => item.serviceName.includes(machineHost));
          if (curItems.length) {
            curItems.forEach(item => {
              item[metricName] = value[1];
            })
          } else {
            curDataSources.push({
              serviceName: metric.instanceName,
              [metricName]: value[1]
            })
          }
        })
      } else {
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
      }
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
