import React, { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { NEBULA_COUNT } from '@/utils/promQL';
import { DETAIL_DEFAULT_RANGE } from '@/utils/dashboard';
import { shouldCheckCluster } from '@/utils';
import './index.less';

const mapState = (state: any) => ({
  cluster: state.cluster?.cluster,
  metricsFilterValues: state.machine.metricsFilterValues,
});

const mapDispatch = (dispatch) => ({});

interface IProps extends ReturnType<typeof mapState>  {
  type: string;
  clusterID?: string;
  getStatus: (payload) => void;
}

function StatusPanel(props: IProps) {

  const { cluster, type, getStatus, metricsFilterValues } = props;

  const pollingTimer: any = useRef<any>();

  const [ statusNumInfo, setStatusNumInfo ] = useState<any>({
    abnormal: 0,
    normal: 0
  });

  useEffect(() => {
    if (pollingTimer.current) {
      clearTimeout(pollingTimer.current);
    }
    if (shouldCheckCluster()) {
      if (cluster.id) {
        pollingData();
      }
    } else {
      pollingData();
    }
    return () => {
      if (pollingTimer.current) {
        clearTimeout(pollingTimer.current);
      }
    }
  }, [cluster, metricsFilterValues.frequency, metricsFilterValues.timeRange])

  const asyncGetStatus = async () => {
    const { normal, abnormal } = (await getStatus({
      query: NEBULA_COUNT[type],
      end: Date.now(),
      interval: DETAIL_DEFAULT_RANGE,
      clusterID: cluster?.id,
    })) as any;
    setStatusNumInfo({ normal, abnormal })
  };

  const pollingData = () => {
    asyncGetStatus();
    if (metricsFilterValues.frequency > 0) {
      pollingTimer.current = setTimeout(pollingData, metricsFilterValues.frequency);
    }
  };

  return (
    <ul className="status-panel">
      <li className="normal">
        {intl.get('service.normal')}: <span>{statusNumInfo.normal}</span>
      </li>
      <li className="abnormal">
        {intl.get('service.abnormal')}: <span>{statusNumInfo.abnormal}</span>
      </li>
    </ul>
  );
}

export default connect(mapState, mapDispatch)(StatusPanel);
