import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Button, Col, Row, Spin } from 'antd';

import { NodeResourceInfo } from '@/utils/interface';
import NodeResourceOverview from './NodeResourceOverview';
import { getMachineMetricData, getNodeInfoQueries } from '@/utils/promQL';
import { calcTimeRange, getMachineRouterPath, getProperByteDesc, TIME_OPTION_TYPE } from '@/utils/dashboard';
import { IntervalFrequencyItem, INTERVAL_FREQUENCY_TYPE } from '@/utils/service';
import EventBus from '@/utils/EventBus';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import Icon from '@/components/Icon';
import DashboardCard from '@/components/DashboardCard';
import TimeSelect from '@/components/TimeSelect';
import MetricCard from '@/components/MetricCard';
import DiskCard from './Cards/DiskCard';
import WaterLevelCard from './Cards/WaterLevelCard';

import styles from './index.module.less';

const mapDispatch: any = (dispatch: any) => ({
  asyncBatchQueries: dispatch.nebula.asyncBatchQueries,
});

const mapState = (state: any) => ({
  instanceList: state.machine.instanceList as any,
  loading: state.loading.effects.nebula.asyncBatchQueries
});
interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  cluster?: any;
}

const IntervalOptions: IntervalFrequencyItem[] = [
  {
    type: INTERVAL_FREQUENCY_TYPE.OFF,
    value: 0,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S5,
    value: 2 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.S15,
    value: 5 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M1,
    value: 5 * 1000,
  },
  {
    type: INTERVAL_FREQUENCY_TYPE.M5,
    value: 5 * 1000,
  },
];

const formatValueByRefId = (refId: string, metricItem: any) => {
  const { metric, value } = metricItem;
  const [timestamp, curValue] = value;
  switch (refId) {
    case "cpuUtilization": case "memoryUtilization": case "diskUtilization":
      return `${parseFloat(curValue).toFixed(2)}%`;
    case "runtime":
      return `${Math.round(parseFloat(curValue))} ${intl.get('device.nodeResource.day')}`;
    case "cpuCore":
      return `${parseInt(curValue)}`;
    case "load5s":
      return `${parseFloat(curValue).toFixed(2)}`;
    case "memory": case "disk": case "memoryUsed": case "diskUsed":
      return getProperByteDesc(parseFloat(curValue)).desc
    case "networkIn": case "networkOut": case "diskMaxRead": case "diskMaxWrite":
      const { value: v, unit } = getProperByteDesc(parseFloat(curValue));
      return `${v} ${unit || 'KB'}/s`
    case "nodeName":
      return metric.nodename
    default:
      return curValue;
  }
}

function MachineDashboard(props: IProps) {

  const { cluster, asyncBatchQueries, instanceList, loading } = props;

  const [resourceInfos, setResourceInfos] = useState<NodeResourceInfo[]>([]);

  const [frequencyValue, setFrequencyValue] = useState<number>(0);

  const [curInstance, setCurInstance] = useState<string>(instanceList[0] || '');

  const [singleNodeLoading, setSingleNodeLoading] = useState<boolean>(false);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);

  const [timeRange, setTimeRange] = useState<TIME_OPTION_TYPE | [number, number]>(TIME_OPTION_TYPE.HOUR1);

  const diskCardRef = useRef<any>();
  const metricRefs = useMemo(() => ({}), []);
  const pollingTimerRef = useRef<any>(null);

  useEffect(() => {
    if (cluster?.id && instanceList?.length) {
      setCurInstance(instanceList[0])
      asyncGetResourceInfos();
    }
  }, [cluster, instanceList])

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
    }
    if (frequencyValue > 0) {
      pollingData();
    }
  }, [frequencyValue])

  useEffect(() => {
    const changeListener = (data) => {
      const { value } = data.detail;
      setFrequencyValue(value);
    }
    const freshListener = () => { handleRefresh(); }
    EventBus.getInstance().on('machineOverview_change', changeListener);

    EventBus.getInstance().on('machineOverview_fresh', freshListener);

    return () => {
      EventBus.getInstance().off('machineOverview_change', changeListener);
      EventBus.getInstance().off('machineOverview_fresh', freshListener);
    }
  }, [cluster, instanceList]);

  const asyncGetResourceInfos = async (shouldLoading?: boolean) => {
    shouldLoading && setOverviewLoading(true);
    const queries = getNodeInfoQueries(cluster.id);
    const data = await asyncBatchQueries(queries);
    const { results } = data;
    const resourceInfoData = instanceList.map(instance => {
      const nodeResourceInfo: NodeResourceInfo = {} as any;
      nodeResourceInfo.host = instance;
      Object.keys(results).forEach(refId => {
        const metricItem = results[refId].result.find(r => r.metric.instance.includes(instance));
        if (metricItem) {
          nodeResourceInfo[refId] = formatValueByRefId(refId, metricItem);
        }
      })
      return nodeResourceInfo;
    })
    setResourceInfos(resourceInfoData);
    shouldLoading && setOverviewLoading(false);
  }

  useEffect(() => {
    if (cluster?.id && curInstance) {
      fetchSingleMonitorData(true);
    }
  }, [curInstance, cluster, timeRange])

  const handleRefresh = () => {
    asyncGetResourceInfos(true);
    fetchSingleMonitorData(true);
  }

  const fetchSingleMonitorData = (shouldLoading?: boolean) => {
    const cardObj = getMachineMetricData(curInstance, cluster, timeRange)
    shouldLoading && setSingleNodeLoading(true);
    diskCardRef.current?.handleRefresh?.();
    Promise.all(
      Object.keys(cardObj)
        .map(key => metricRefs[key]?.handleRefresh?.()))
      .then(() => {
        shouldLoading && setSingleNodeLoading(false);
      })
  }

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  const pollingData = () => {
    asyncGetResourceInfos();
    fetchSingleMonitorData();
    if (frequencyValue > 0) {
      pollingTimerRef.current = setInterval(() => {
        asyncGetResourceInfos();
        fetchSingleMonitorData();
      }, frequencyValue);
    }
  }

  const handleInstanceChange = (value: string) => {
    setCurInstance(value);
  }

  const getViewPath = (path: string): string => {
    if (cluster?.id) {
      return getMachineRouterPath(path, cluster.id);
    }
    return path;
  }

  const handleTimeSelectChange = (value: TIME_OPTION_TYPE | [number, number]) => {
    setTimeRange(value);
  }

  const renderCardContent = () => {
    const cardObj = getMachineMetricData(curInstance, cluster, timeRange)
    return Object.keys(cardObj).map(key => (
      <DashboardCard
        key={key}
        title={cardObj[key].title}
        viewPath={cardObj[key].viewPath ? getViewPath(cardObj[key].viewPath) : undefined }
      >
        <MetricCard
          ref={ref => metricRefs[key] = ref}
          asyncBatchQueries={asyncBatchQueries}
          queries={cardObj[key].queries}
          valueType={cardObj[key].valueType}
        />
      </DashboardCard >
    ))
  }

  return (
    <div className={styles.machineDashboarContent}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>{intl.get('device.nodeResource.title')}</div>
        <div className={styles.content}>
          <NodeResourceOverview
            resourceInfos={resourceInfos}
            loading={overviewLoading}
          />
        </div>
      </div>
      <div className={styles.singelNodeMonitor}>
        <div className={styles.monitorTitle}>{intl.get('device.nodeResource.singleNodeTitle')}</div>
        <div className={styles.action}>
          <TimeSelect value={timeRange} onChange={handleTimeSelectChange} />
          <DashboardSelect className={styles.instanceSelect} value={curInstance} onChange={handleInstanceChange}>
            {
              instanceList.map((instance: string) => (
                <Option key={instance} value={instance}>{instance}</Option>
              ))
            }
          </DashboardSelect>
          <Button
            type="primary"
            onClick={() => { }}
            className={`${styles.primaryBtn} ${styles.addPanelBtn}`}
          >
            <Icon icon="#iconPlus" />
            {intl.get('common.addPanel')}
          </Button>
        </div>
      </div>
      <Spin spinning={singleNodeLoading}>
        <Row>
          <Col span={12}>
            <DashboardCard
              title={intl.get('device.nodeResource.waterLevel')}
            >
              <WaterLevelCard nodeResource={resourceInfos.find(info => info.host === curInstance)} />
            </DashboardCard >
          </Col>
          <Col span={12}>
            <DashboardCard
              title={intl.get('device.disk')}
              viewPath={getViewPath("/machine/disk")}
            >
              <DiskCard ref={diskCardRef} cluster={cluster} instance={curInstance} asyncBatchQueries={asyncBatchQueries} />
            </DashboardCard >
          </Col>
        </Row>
        <div className={styles.chartContent}>
          {
            renderCardContent()
          }
        </div>
      </Spin>
    </div>
  );
}

export default connect(mapState, mapDispatch)(MachineDashboard);