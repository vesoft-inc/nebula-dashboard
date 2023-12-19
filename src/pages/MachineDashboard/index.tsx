import { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Button, Col, Row, Spin } from 'antd';

import { MachinePanelConfig, NodeResourceInfo } from '@/utils/interface';
import NodeResourceOverview from './NodeResourceOverview';
import { getNodeInfoQueries } from '@/utils/promQL';
import { getMachineRouterPath, getProperByteDesc, TIME_OPTION_TYPE } from '@/utils/dashboard';
import EventBus from '@/utils/EventBus';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import DashboardCard from '@/components/DashboardCard';
import TimeSelect from '@/components/TimeSelect';
import MetricCard from '@/components/MetricCard';
import DiskCard from './Cards/DiskCard';
import WaterLevelCard from './Cards/WaterLevelCard';
import { asyncBatchQueries } from '@/requests';
import { LINUX as PROMQL } from '@/utils/promQL';

import styles from './index.module.less';
import Icon from '@/components/Icon';
import defaultMachinePanelConfig from './defaultMachinePanelConfig';

const mapDispatch: any = (_dispatch: any) => ({
});

const mapState = (state: any) => ({
  instanceList: state.machine.instanceList as any,
  cluster: state.cluster.cluster,
});
interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  enableAddPanel?: boolean;
  onAddPanel?: () => void;
  onEditPanel?: (panelItem: MachinePanelConfig) => void;
  panelConfigs?: MachinePanelConfig[];
}

const formatValueByRefId = (refId: string, metricItem: any) => {
  const { metric, value } = metricItem;
  const [_timestamp, curValue] = value;
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

  const { cluster, instanceList, enableAddPanel, onAddPanel, onEditPanel, panelConfigs = defaultMachinePanelConfig } = props;

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
    const data: any = await asyncBatchQueries(queries);
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
    if (panelConfigs.length) {
      fetchSingleMonitorData(true);
    }
  }, [timeRange, panelConfigs])

  const handleRefresh = () => {
    asyncGetResourceInfos(true);
    fetchSingleMonitorData(true);
  }

  const fetchSingleMonitorData = (shouldLoading?: boolean) => {
    if (!cluster?.id || !curInstance) return;
    shouldLoading && setSingleNodeLoading(true);
    diskCardRef.current?.handleRefresh?.();
    const promsises = panelConfigs.map(panelConfigItem => metricRefs[panelConfigItem.key]?.handleRefresh?.())
   
    Promise.all(promsises).then(() => {
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
  
  const onChangeBrush = (panelKey: string, brush) => {
    Object.keys(metricRefs).forEach(key => {
      if (key !== panelKey || !brush) {
        metricRefs[key].chartRef.changeBrushByRangeFilter(brush);
      }
    });
  }

  const getMachineQueries = (refIds: string[]) => {
    if (!cluster?.id) return [];
    return refIds.map(refId => ({
      refId,
      query: PROMQL(cluster.id, '', curInstance)[refId]
    }));
  }

  const sortedPanels = (panels: MachinePanelConfig[]) => {
    return panels.sort((panelA, panelB) => {
      const AIndex = panelA.showIndex ? +panelA.showIndex : Number.MAX_VALUE;
      const BIndex = panelB.showIndex ? +panelB.showIndex : Number.MAX_VALUE;
      return AIndex - BIndex;
    });
  }

  const renderCardContent = () => {
    return sortedPanels(panelConfigs).map((panelConfigItem: MachinePanelConfig, index) => (
      <DashboardCard
        key={index}
        title={panelConfigItem.title}
        onConfigPanel={onEditPanel ? () => onEditPanel(panelConfigItem): undefined}
        viewPath={getViewPath(`/machine-metric/${panelConfigItem.key}/${curInstance.replaceAll('.', '_')}`)}
      >
        <MetricCard
          ref={ref => metricRefs[panelConfigItem.key] = ref}
          onChangeBrush={(brush) => {
            onChangeBrush(panelConfigItem.key, brush);
          }}
          queries={getMachineQueries(panelConfigItem.refIds)}
          valueType={panelConfigItem.valueType}
          timeRange={timeRange}
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
        <div className={styles.singelNodeMonitorHeader}>
          <div className={styles.monitorTitle}>
            {intl.get('device.nodeResource.singleNodeTitle')}
            <DashboardSelect className={styles.instanceSelect} value={curInstance} onChange={handleInstanceChange}>
              {
                instanceList.map((instance: string) => (
                  <Option key={instance} value={instance}>{instance}</Option>
                ))
              }
            </DashboardSelect>
          </div>
          <div className={styles.action}>
            <TimeSelect value={timeRange} onChange={handleTimeSelectChange} />
            {
              enableAddPanel && (
                <Button
                  type="primary"
                  onClick={onAddPanel}
                  className={`${styles.primaryBtn} ${styles.addPanelBtn}`}
                >
                  <Icon icon="#iconPlus" />
                  {intl.get('common.addPanel')}
                </Button>
              )
            }
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
                viewPath={getViewPath(`/machine-metric/disk/${curInstance}`)}
              >
                <DiskCard ref={diskCardRef} cluster={cluster} instance={curInstance} />
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
    </div>
  );
}

export default connect(mapState, mapDispatch)(MachineDashboard);