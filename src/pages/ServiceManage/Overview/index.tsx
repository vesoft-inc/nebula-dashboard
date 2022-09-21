import React, { useMemo, useRef, useState } from 'react';
import { Button, Modal as AntModal, message } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { RouteComponentProps, Link } from 'react-router-dom';
import LeaderDistribution from '@/pages/ServiceManage/LeaderDistribution';
import ServiceInfo from '@/pages/ServiceManage/ServiceInfo';
import VersionStatistic from '@/pages/ServiceManage/VersionStatistic';
import PartitionDistribution from '@/pages/ServiceManage/PartitionDistribution';
import PartitionInfo from '@/pages/ServiceManage/PartitionInfo';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { getVersionFeatures } from '@/utils/versionFeature';
import Modal from '@/components/Modal';
import { IDispatch, IRootState } from '@/store';
import { DEFAULT_VERSION, formatVersion } from '@/utils/dashboard';

import styles from './index.module.less';
import { isCommunityVersion } from '@/utils';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  asyncGetHostsInfo: dispatch.nebula.asyncGetHostsInfo,
  asyncGetServices: dispatch.nebula.asyncGetServices,
  asyncExecNGQL: dispatch.nebula.asyncExecNGQL,
});

const mapState = (state: IRootState) => ({
  spaces: state.nebula.spaces,
  currentSpace: state.nebula.currentSpace,
});

interface IHaderProps {
  title: string;
  path: string;
}
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps {
  baseRouter?: string;
}

const OverviewCardHeader = (props: IHaderProps) => {
  const { title, path } = props;
  return (
    <div className={styles.header}>
      {title}
      <Link to={path}>{intl.get('common.detail')}</Link>
    </div>
  );
};

const Overview: React.FC<IProps> = (props: IProps) => {

  const { cluster, currentSpace, spaces, baseRouter = '/management' } = props;

  const modalHandler = useRef<any>();
  const [hosts, setHosts] = useState([]);

  const handleSpaceChange = async space => {
    const { code } = await props.asyncUseSpaces(space);
    if (code === 0) {
      const res = await props.asyncGetHostsInfo();
      setHosts(res);
    }
  };

  const handleModalClose = () => {
    if (modalHandler.current) {
      modalHandler.current.hide();
    }
  };

  const balanceData = async () => {
    const code = await props.asyncExecNGQL('submit job balance data');
    if (code === 0) {
      message.success(intl.get('common.succeed'));
      props.asyncGetServices();
    }
  };

  const handleBalance = () => {
    AntModal.confirm({
      content: intl.get('common.confirmAction'),
      okText: intl.get('common.confirm'),
      cancelText: intl.get('common.cancel'),
      onOk: () => balanceData(),
    });
  };

  const handleHostChange = async host => {
    const code = await props.asyncExecNGQL(
      `submit job balance data remove ${host}`,
    );
    if (code === 0) {
      message.success(intl.get('common.succeed'));
      props.asyncGetServices();
    }
    handleModalClose();
  };

  const handleModalShow = async () => {
    if (modalHandler && modalHandler.current) {
      modalHandler.current.show();
    }
  };

  const versionFeature = useMemo(() => {
    const version = formatVersion(cluster?.version || DEFAULT_VERSION);
    return getVersionFeatures(version, cluster?.nebulaType);
  }, [cluster]);

  return (
    <div>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.leader}>
            {/* @ts-ignore */}
            <LeaderDistribution isOverview baseRouter={baseRouter} />
          </div>
          <div className={styles.serviceInfo}>
            <OverviewCardHeader
              title={intl.get('common.serviceInfo')}
              path={`service-info`}
            />
            <ServiceInfo />
          </div>
        </div>
        <div className={styles.right}>
          <OverviewCardHeader
            title={intl.get('common.version')}
            path={`${baseRouter}/version-statistics`}
          />
          {/* @ts-ignore */}
          <VersionStatistic isOverview />
        </div>
      </div>
      <div className={styles.prat}>
        <div className={styles.pratHeader}>
          <DashboardSelect
            placeholder={intl.get('service.chooseSpace')}
            value={currentSpace || undefined}
            onChange={handleSpaceChange}
            style={{
              width: 220,
            }}
          >
            {spaces.map((space: any) => (
              <Option value={space.Name} key={space.Name}>
                {space.Name}
              </Option>
            ))}
          </DashboardSelect>
          {
            !isCommunityVersion() && (
              <>
                <Button
                  type="primary"
                  onClick={handleBalance}
                  disabled={!versionFeature?.dataBalance || !currentSpace}
                >
                  Balance Data
                </Button>
                <Button
                  type="primary"
                  onClick={handleModalShow}
                  ghost
                  disabled={!versionFeature?.dataBalance || !currentSpace}
                >
                  Balance Data Remove
                </Button>
              </>
            )
          }
        </div>
        <div className={styles.distribution}>
          <OverviewCardHeader
            title={`Partition ${intl.get('service.distribution')}`}
            path={`${baseRouter}/partition-distribution`}
          />
          {/* @ts-ignore */}
          <PartitionDistribution isOverview />
        </div>
        <div className={styles.info}>
          <OverviewCardHeader
            title={intl.get('common.partitionInfo')}
            path={`${baseRouter}/partition-info`}
          />
          {/* @ts-ignore */}
          <PartitionInfo isOverview />
        </div>
      </div>
      <Modal
        title={intl.get('service.chooseHost')}
        wrapClassName={styles.modal}
        handlerRef={handler => (modalHandler.current = handler)}
        footer={null}
      >
        <DashboardSelect
          placeholder={intl.get('service.chooseHost')}
          onChange={handleHostChange}
          style={{
            width: 220,
          }}
        >
          {
            hosts.map((host: any) => (
              <Option
                value={`${host.Host}:${host.Port}`}
                key={`${host.Host}:${host.Port}`}
              >
                {host.Host}
              </Option>
            )) as any
          }
        </DashboardSelect>
      </Modal>
    </div>
  );
};

export default connect(mapState, mapDispatch)(Overview);
