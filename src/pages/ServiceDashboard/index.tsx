import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Button, Spin } from 'antd';

import TimeSelect from '@/components/TimeSelect';
import { calcTimeRange, TIME_OPTION_TYPE } from '@/utils/dashboard';
import Icon from '@/components/Icon';

import { ServiceName } from '@/utils/interface';
import { defaultServicePanelConfigData, ServicePanelConfig, ServicePanelConfigItem } from './defaultPanelConfig';
import ServiceOverview from './ServiceOverview';

import styles from './index.module.less';
import OverviewTable from './OverviewTable';

const mapDispatch: any = (dispatch: any) => ({
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
});

const mapState = (state: any) => ({
  loading: state.loading.effects.nebula.asyncBatchQueries,
  cluster: state.cluster.cluster,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  enableAddPanel?: boolean;
  onAddPanel?: () => void;
  onEditPanel?: (panelItem: ServicePanelConfig, serviceName: ServiceName) => void;
  panelConfigs?: ServicePanelConfigItem[];
}

export const ServicePanels = [
  ServiceName.GRAPHD,
  ServiceName.STORAGED,
  ServiceName.METAD,
  // ClusterServiceNameMap[ServiceName.MetadListener],
  // ClusterServiceNameMap[ServiceName.StoragedListener],
  // ClusterServiceNameMap[ServiceName.Drainer],
]

export type ServicePanelType = {
  [key in typeof ServicePanels[number]]: string[];
};

function ServiceDashboard(props: IProps) {
  const { cluster, enableAddPanel, onAddPanel, panelConfigs, onEditPanel, asyncGetSpaces } = props;

  const [timeRange, setTimeRange] = useState<TIME_OPTION_TYPE | [number, number]>(TIME_OPTION_TYPE.HOUR1);

  const handleTimeSelectChange = (value: TIME_OPTION_TYPE | [number, number]) => {
    setTimeRange(value);
  }

  const [curServiceMap, setCurServiceMap] = useState<ServicePanelType>({} as ServicePanelType);

  useEffect(() => {
    if (cluster.id) {
      getServiceNames();
    }
  }, [cluster]);

  useEffect(() => {
    const [start, end] = calcTimeRange(timeRange);
    if (cluster?.id) {
      asyncGetSpaces({
        clusterID: cluster.id,
        start,
        end
      })
    }
  }, [timeRange, cluster])

  const [curPanelConfigs, setCurPanelConfigs] = useState<ServicePanelConfigItem[]>(panelConfigs || defaultServicePanelConfigData);

  useEffect(() => {
    if (panelConfigs) {
      setCurPanelConfigs(panelConfigs);
    }
  }, [panelConfigs])

  const getServiceNames = () => {
    const serviceTypeMap: ServicePanelType = {} as ServicePanelType;
    ServicePanels.forEach((panel: string) => {
      serviceTypeMap[panel] = (cluster[panel] || []).map(i => i.name);
    });
    setCurServiceMap(serviceTypeMap);
  }

  const handleEditServicePanel = (serviceName: ServiceName) => (configItem: ServicePanelConfig) => {
    onEditPanel && onEditPanel(configItem, serviceName);
  }

  return (
    <div className={styles.serviceDashboarContent}>
      {/* @ts-ignore */}
      <OverviewTable serviceMap={curServiceMap} />
      <div className={styles.singelNodeMonitor}>
        <div className={styles.singelNodeMonitorHeader}>
          <div className={styles.monitorTitle}>{intl.get('device.serviceResource.singleServiceTitle')}</div>
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
      </div>
      {
        curPanelConfigs.map((panelConfig, index) => (
          <div key={index} className={styles.servicePanel}>
            <ServiceOverview
              /* @ts-ignore */
              serviceNames={curServiceMap[panelConfig.type] || []}
              timeRange={timeRange}
              serviceType={panelConfig.type}
              panelVisible={index === 0}
              onEditPanel={handleEditServicePanel(panelConfig.type)}
              panelConfigData={panelConfig.panels}
            />
          </div>
        ))
      }
    </div>
  );
}

export default connect(mapState, mapDispatch)(ServiceDashboard);