import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
// import { IDispatch } from '@/store';
import { NEBULA_COUNT } from '@/utils/promQL';
import { DETAIL_DEFAULT_RANGE } from '@/utils/dashboard';
import { SERVICE_POLLING_INTERVAL } from '@/utils/service';
import { isEnterpriseVersion } from '@/utils';

import './index.less';

const mapState = (state: any) => ({
  cluster: state.cluster?.cluster,
});

const mapDispatch = (dispatch) => ({});

const shouldCheckCluster = isEnterpriseVersion();

interface IProps extends ReturnType<typeof mapState>  {
  type: string;
  clusterID?: string;
  getStatus: (payload) => void;
}

interface IState {
  normal: number;
  abnormal: number;
}
class StatusPanel extends React.Component<IProps, IState> {
  pollingTimer: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      normal: 0,
      abnormal: 0,
    };
  }

  componentDidMount() {
    this.pollingData();
  }

  pollingData = () => {
    if (shouldCheckCluster) {
      const { cluster } = this.props;
      if (cluster.id) {
        this.asyncGetStatus();
        this.pollingTimer = setTimeout(this.pollingData, SERVICE_POLLING_INTERVAL);
      }
    } else {
      this.asyncGetStatus();
      this.pollingTimer = setTimeout(this.pollingData, SERVICE_POLLING_INTERVAL);
    }
  };

  componentWillUnmount() {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  asyncGetStatus = async () => {
    const { type, cluster } = this.props;
    const { normal, abnormal } = (await this.props.getStatus({
      query: NEBULA_COUNT[type],
      end: Date.now(),
      interval: DETAIL_DEFAULT_RANGE,
      clusterID: cluster?.id,
    })) as any;
    this.setState({ normal, abnormal });
  };

  render() {
    const { normal, abnormal } = this.state;
    return (
      <ul className="status-panel">
        <li className="normal">
          {intl.get('service.normal')}: <span>{normal}</span>
        </li>
        <li className="abnormal">
          {intl.get('service.abnormal')}: <span>{abnormal}</span>
        </li>
      </ul>
    );
  }
}

export default connect(mapState, mapDispatch)(StatusPanel);
