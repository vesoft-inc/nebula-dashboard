import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { BatchQueryItem, IServiceMetricItem, ServiceName } from '@/utils/interface';
import ServiceHeader from '@/components/Service/ServiceHeader';
import Icon from '@/components/Icon';
import { AggregationType, TIME_OPTION_TYPE } from '@/utils/dashboard';
import { ServicePanelConfig } from '../defaultPanelConfig';
import MetricCard, { PromResultMetric } from '@/components/MetricCard';

import styles from './index.module.less';
import { getClusterPrefix } from '@/utils/promQL';
import { getQueryByMetricType } from '@/utils/metric';
import DashboardCard from '@/components/DashboardCard';

import { Spin } from 'antd';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import EventBus from '@/utils/EventBus';


const mapDispatch: any = (_dispatch: any) => ({
});

const mapState = (state: any) => ({
  serviceMetric: state.serviceMetric,
  ready: state.serviceMetric.ready,
  cluster: state.cluster.cluster
});

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  serviceType: ServiceName;
  serviceNames: string[];
  panelConfigData: ServicePanelConfig[];
  timeRange: TIME_OPTION_TYPE | [number, number];
  panelVisible?: boolean;
  onEditPanel: (panelItem: ServicePanelConfig) => void;
}

function ServiceOverview(props: IProps) {
  const { serviceType, panelConfigData, serviceNames, timeRange, cluster, ready, serviceMetric, panelVisible, onEditPanel } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [frequencyValue, setFrequencyValue] = useState<number>(0);
  const [curPanelVisile, setCurPanelVisible] = useState<boolean>(panelVisible || false);
  const metricRefs = useMemo(() => ({}), []);
  const metricOptions = useMemo<IServiceMetricItem[]>(() => {
    if (!ready) return [];
    return serviceMetric[serviceType] || [];
  }, [ready]);
  const [curServiceName, setCurServiceName] = useState<string>(serviceNames[0] || '');
  const pollingTimerRef = useRef<any>(null);
  useEffect(() => {
    if (serviceNames.length > 0) {
      setCurServiceName(serviceNames[0]);
    }
  }, [serviceNames])

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
  }, [cluster]);

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
    }
    if (frequencyValue > 0) {
      pollingData();
    }
  }, [frequencyValue])

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  const pollingData = () => {
    fetchServiceMonitorData(false);
    if (frequencyValue > 0) {
      pollingTimerRef.current = setInterval(() => {
        fetchServiceMonitorData(false);
      }, frequencyValue);
    }
  }

  const handleRefresh = () => {
    fetchServiceMonitorData(true);
  }

  const getQueries = (configItem: ServicePanelConfig) => {
    const queries = configItem.queries
      .filter((queryItem: BatchQueryItem) => metricOptions.find((item: IServiceMetricItem) => item.metric === queryItem.query))
      .map((queryItem: BatchQueryItem) => {
        const metricItem = metricOptions.find((item: IServiceMetricItem) => item.metric === queryItem.query)!;
        const aggregation = metricItem.aggregations.includes(AggregationType.Sum)
          ? AggregationType.Sum
          : (metricItem.aggregations[0] as AggregationType);
        const spaceSuffix = configItem.space != undefined ? `,space="${configItem.space}"` : '';
        let query = getQueryByMetricType(metricItem, aggregation, '5');
        const clusterSuffix1 = cluster ? `,${getClusterPrefix()}="${cluster.id}"` : '';
        if (aggregation === AggregationType.Sum && !metricItem.isRawMetric) {
          query = `sum_over_time(${query}{instanceName="${curServiceName}"${clusterSuffix1}${spaceSuffix}}[${15}s])`;
        } else {
          if (query.includes('cpu_seconds_total')) {
            query = `avg by (instanceName) (rate(${query}{instanceName="${curServiceName}"${clusterSuffix1}}[5m])) * 100`
          } else {
            query = `${query}{instanceName="${curServiceName}"${clusterSuffix1}${spaceSuffix}}`;
          }
        }
        return {
          refId: queryItem.query,
          query,
        }
      })
    return queries;
  }

  useEffect(() => {
    if (!panelConfigData.length || !metricOptions.length || !curPanelVisile) return;
    fetchServiceMonitorData(true);
  }, [panelConfigData, metricOptions, curServiceName, timeRange, curPanelVisile])

  const fetchServiceMonitorData = (shouldLoading: boolean) => {
    if (!curPanelVisile) return;
    shouldLoading && setLoading(true);
    const indexs = Array.from({ length: panelConfigData.length }, (_, i) => i + 1)
    Promise.all(
      indexs
        .map(key => metricRefs[key]?.handleRefresh?.()))
      .then(() => {
        shouldLoading && setLoading(false);
      })
  }

  const handleMetricType = (resultNum: number, key: string, resultMetric: PromResultMetric) => {
    if (resultNum > 1) {
      return `${resultMetric.instanceName} - ${key}`
    }
    return key;
  }

  const handleInstanceChange = (serviceName: string) => {
    setCurServiceName(serviceName);
  }

  const handlePanelClick = () => {
    setCurPanelVisible(!curPanelVisile);
  };

  const onChangeBrush = (metricIndex: number, brush) => {
    Object.keys(metricRefs).forEach(key => {
      if (key !== `${metricIndex}` || !brush) {
        metricRefs[key].chartRef.changeBrushByRangeFilter(brush);
      }
    });
  }

  const getViewPath = (serviceType: string, serviceName: string, panelName: string) => {
    return `/clusters/${cluster.id}/service-metric/${serviceType}/${serviceName}/${encodeURIComponent(panelName)}`;
  }

  const sortedPanels = (panels: ServicePanelConfig[]) => {
    return panels.sort((panelA, panelB) => {
      const AIndex = panelA.showIndex ? +panelA.showIndex : Number.MAX_VALUE;
      const BIndex = panelB.showIndex ? +panelB.showIndex : Number.MAX_VALUE;
      return AIndex - BIndex;
    });
  }

  return (
    <div className={styles.serviceTableItem}>
      <ServiceHeader serviceType={serviceType} title={
        <div className={`${styles.headerTitle} ${curPanelVisile ? '' : styles.panelVisible}`}>
          <div className={styles.titleContent} onClick={handlePanelClick}>
            <Icon icon="#iconnav-foldTriangle" />
            <span style={{ margin: "0 12px" }}>{`${serviceType} ${intl.get('common.service')}`}</span>
          </div>
          {
            curPanelVisile && (
              <DashboardSelect
                onChange={handleInstanceChange}
                value={curServiceName}
              >
                {serviceNames.map((instance) => (
                  <Option key={instance} value={instance}>
                    {instance}
                  </Option>
                ))
                }
              </DashboardSelect>
            )
          }
        </div>
      }>
        {
          curPanelVisile && (
            <div className="btn-icon-with-desc blue">
              <Icon icon="#iconwatch" />
              <span>{intl.get('common.view')}</span>
            </div>
          )
        }
      </ServiceHeader>
      {
        curPanelVisile && (
          <Spin spinning={loading}>
            <div className={styles.serviceTableItemContent}>
              {
                sortedPanels(panelConfigData).map((configItem: ServicePanelConfig, index) => (
                  <DashboardCard
                    title={configItem.title}
                    key={index}
                    viewPath={getViewPath(serviceType, curServiceName, configItem.title)}
                    onConfigPanel={() => onEditPanel(configItem)}
                  >
                    <MetricCard
                      ref={ref => metricRefs[index + 1] = ref}
                      valueType={configItem.valueType}
                      onChangeBrush={(brush) => {
                        onChangeBrush(index+1,brush);
                      }}
                      queries={getQueries(configItem)}
                      timeRange={timeRange}
                      metricTypeFn={handleMetricType}
                    />
                  </DashboardCard>
                ))
              }
            </div>
          </Spin>
        )
      }
    </div>
  )
}

export default connect(mapState, mapDispatch)(ServiceOverview);