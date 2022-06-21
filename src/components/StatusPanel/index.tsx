import React, { useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { NEBULA_COUNT } from '@/utils/promQL';
import { DETAIL_DEFAULT_RANGE } from '@/utils/dashboard';
import { SERVICE_POLLING_INTERVAL } from '@/utils/service';
import { shouldCheckCluster } from '@/utils';
import './index.less';

const mapState = (state: any) => ({
  cluster: state.cluster?.cluster,
});

const mapDispatch = (dispatch) => ({});

interface IProps extends ReturnType<typeof mapState>  {
  type: string;
  clusterID?: string;
  getStatus: (payload) => void;
}

function StatusPanel(props: IProps) {

  const { cluster, type, getStatus } = props;

  const pollingTimer: any = useRef<any>();

  const [ statusNumInfo, setStatusNumInfo ] = useState<any>({
    abnormal: 0,
    normal: 0
  });

  useEffect(() => {
    pollingData();
    return () => {
      if (pollingTimer.current) {
        clearTimeout(pollingTimer.current);
      }
    }
  }, [cluster])

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
    if (shouldCheckCluster()) {
      if (cluster.id) {
        asyncGetStatus();
        pollingTimer.current = setTimeout(pollingData, SERVICE_POLLING_INTERVAL);
      }
    } else {
      asyncGetStatus();
      pollingTimer.current = setTimeout(pollingData, SERVICE_POLLING_INTERVAL);
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
