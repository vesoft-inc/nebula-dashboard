import React, { useMemo, useRef, useState, useEffect } from 'react';
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
import { formatVersion } from '@/utils/dashboard';
import { isCommunityVersion } from '@/utils';

import styles from './index.module.less';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  asyncGetHostsInfo: dispatch.nebula.asyncGetHostsInfo,
  asyncGetServices: dispatch.nebula.asyncGetServices,
  asyncExecNGQL: dispatch.nebula.asyncExecNGQL,
  getJobs: dispatch.nebula.getJobs,
  clear: dispatch.nebula.clear,
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
  cluster?: any;
  enableZone?: boolean;
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
  const nebulaRef = useRef<{
    currentSpace: any;
  }>({
    currentSpace,
  });
  nebulaRef.current.currentSpace = currentSpace;
  useEffect(() => {
    props.clear();
  }, [cluster]);
  useEffect(() => {
    asyncGetHostsInfo();
  }, []);

  const handleSpaceChange = async space => {
    const { code } = await props.asyncUseSpaces(space);
    if (code === 0) {
      asyncGetHostsInfo();
    }
  };

  const asyncGetHostsInfo = async () => {
    const res = await props.asyncGetHostsInfo();
    setHosts(res);
  };

  const handleModalClose = () => {
    if (modalHandler.current) {
      modalHandler.current.hide();
    }
  };

  const balanceData = async () => {
    const { code } = await props.asyncExecNGQL(
      props.enableZone
        ? 'submit job balance data in zone'
        : 'submit job balance data',
    );
    if (code === 0) {
      message.success(intl.get('common.successDelay'));
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
    AntModal.confirm({
      content: intl.get('common.confirmAction'),
      okText: intl.get('common.confirm'),
      cancelText: intl.get('common.cancel'),
      onOk: async () => {
        const { code } = await props.asyncExecNGQL(
          props.enableZone
            ? `submit job balance data remove in zone ${host}`
            : `submit job balance data remove ${host}`,
        );
        if (code === 0) {
          message.success(intl.get('common.successDelay'));
          props.asyncGetServices();
        }
        handleModalClose();
      },
    });
  };

  const handleModalShow = async () => {
    if (modalHandler && modalHandler.current) {
      modalHandler.current.show();
    }
  };

  const versionFeature = useMemo(() => {
    const version = formatVersion(cluster?.version);
    return getVersionFeatures(version, cluster?.nebulaType);
  }, [cluster]);

  return (
    <div>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.leader}>
            {/* @ts-ignore */}
            <LeaderDistribution
              isOverview
              baseRouter={baseRouter}
              cluster={cluster}
            />
          </div>
          <div className={styles.serviceInfo}>
            <OverviewCardHeader
              title={intl.get('common.StoragedInfo')}
              path={`service-info`}
            />
            {/* @ts-ignore */}
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
          {!isCommunityVersion() && (
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
          )}
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
            hosts.map((host: any, index) => (
              <Option
                value={`"${host.Host}":${host.Port}`}
                key={index}
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
