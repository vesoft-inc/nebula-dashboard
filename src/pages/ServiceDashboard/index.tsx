import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Button, Spin } from 'antd';

import TimeSelect from '@/components/TimeSelect';
import { TIME_OPTION_TYPE } from '@/utils/dashboard';
import Icon from '@/components/Icon';

import { ServiceName } from '@/utils/interface';
import { ClusterServiceNameMap } from '@/utils/metric';
import { defaultServicePanelConfigData } from './defaultPanelConfig';
import ServiceOverview from './ServiceOverview';

import styles from './index.module.less';

const mapDispatch: any = (_dispatch: any) => ({
});

const mapState = (state: any) => ({
  loading: state.loading.effects.nebula.asyncBatchQueries,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  cluster?: any;
}

const ServicePanels = [
  ServiceName.GRAPHD,
  ServiceName.STORAGED,
  ServiceName.METAD,
  ClusterServiceNameMap[ServiceName.MetadListener],
  ClusterServiceNameMap[ServiceName.StoragedListener],
  ClusterServiceNameMap[ServiceName.Drainer],
]

function ServiceDashboard(props: IProps) {
  const { cluster } = props;

  const [timeRange, setTimeRange] = useState<TIME_OPTION_TYPE | [number, number]>(TIME_OPTION_TYPE.HOUR1);

  const handleTimeSelectChange = (value: TIME_OPTION_TYPE | [number, number]) => {
    setTimeRange(value);
  }

  const [serviceNames, setServiceNames] = useState<string[]>([]);

  useEffect(() => {
    if (cluster.id) {
      getServiceNames();
    }
  }, [cluster])

  const getServiceNames = () => {
    let services: string[] = [];
    ServicePanels.forEach((panel: string) => {
      services = services.concat(cluster[panel].map(i => i.name))
    });
    setServiceNames(services);
  }



  return (
    <div className={styles.serviceDashboarContent}>
      <div className={styles.singelNodeMonitor}>
        <div className={styles.singelNodeMonitorHeader}>
          <div className={styles.monitorTitle}>{intl.get('device.nodeResource.singleNodeTitle')}</div>
          <div className={styles.action}>
            <TimeSelect value={timeRange} onChange={handleTimeSelectChange} />
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
      </div>
      <ServiceOverview
        cluster={cluster}
        serviceNames={serviceNames.filter(s => s.includes(ServiceName.GRAPHD))}
        timeRange={timeRange}
        serviceType={ServiceName.GRAPHD}
        panelVisible
        panelConfigData={defaultServicePanelConfigData.find(item => item.type === ServiceName.GRAPHD)?.panels || []}
      />
      <ServiceOverview
        cluster={cluster}
        serviceNames={serviceNames.filter(s => s.includes(ServiceName.METAD))}
        timeRange={timeRange}
        serviceType={ServiceName.METAD}
        panelConfigData={defaultServicePanelConfigData.find(item => item.type === ServiceName.METAD)?.panels || []}
      />
      <ServiceOverview
        cluster={cluster}
        serviceNames={serviceNames.filter(s => s.includes(ServiceName.STORAGED))}
        timeRange={timeRange}
        serviceType={ServiceName.STORAGED}
        panelConfigData={defaultServicePanelConfigData.find(item => item.type === ServiceName.STORAGED)?.panels || []}
      />
    </div>
  );
}

export default connect(mapState, mapDispatch)(ServiceDashboard);