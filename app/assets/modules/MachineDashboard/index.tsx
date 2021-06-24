import DashboardCard from '@assets/components/DashboardCard';
import { IDispatch } from '@assets/store';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import React from 'react';
import intl from 'react-intl-universal';
import { CARD_POLLING_INTERVAL, CARD_RANGE } from '@assets/utils/dashboard';
import { SUPPORT_METRICS } from '@assets/utils/promQL';
import CPUCard from './Cards/CPUCard';
import './index.less';
import MemoryCard from './Cards/MemoryCard';
import DiskCard from './Cards/DiskCard';
import LoadCard from './Cards/LoadCard';
import NetworkOut from './Cards/NetworkOut';
import NetworkIn from './Cards/NetworkIn';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetCPUStatByRange: dispatch.machine.asyncGetCPUStatByRange,
    asyncGetMemoryStatByRange: dispatch.machine.asyncGetMemoryStatByRange,
    asyncGetMemorySizeStat: dispatch.machine.asyncGetMemorySizeStat,
    asyncGetDiskSizeStat: dispatch.machine.asyncGetDiskSizeStat,
    asyncGetDiskStatByRange: dispatch.machine.asyncGetDiskStatByRange,
    asyncGetLoadByRange: dispatch.machine.asyncGetLoadByRange,
    asyncGetNetworkStatByRange: dispatch.machine.asyncGetNetworkStatByRange,
  };
};

const mapState = () => {
  return {};
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {

}

class MachineDashboard extends React.Component<IProps> {
  pollingTimer: any;

  componentDidMount() {
    this.props.asyncGetMemorySizeStat();
    this.props.asyncGetDiskSizeStat();

    this.getMachineStatus();
    this.pollingMachineStatus();
  }

  componentWillUnmount() {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  getMachineStatus = () => {
    const end = Date.now();
    const start = end - CARD_RANGE;
    this.props.asyncGetCPUStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.cpu[0].metric,
    });
    this.props.asyncGetMemoryStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.memory[0].metric,
    });
    this.props.asyncGetDiskStatByRange({
      start: end - 1000,
      end,
      metric: SUPPORT_METRICS.disk[0].metric,
    });
    this.props.asyncGetLoadByRange({
      start,
      end,
      metric: SUPPORT_METRICS.load[0].metric,
    });
    this.props.asyncGetNetworkStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.network[0].metric,
      inOrOut: 'in',
    });
    this.props.asyncGetNetworkStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.network[1].metric,
      inOrOut: 'out',
    });
  }

  pollingMachineStatus = () => {
    this.pollingTimer = setTimeout(() => {
      this.getMachineStatus();
      this.pollingMachineStatus();
    }, CARD_POLLING_INTERVAL);
  }

  render() {
    return <div className="machine-dashboard">
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.cpu')} viewPath="/machine/cpu">
            <CPUCard />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.memory')} viewPath="/machine/memory">
            <MemoryCard />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.load')} viewPath="/machine/load">
            <LoadCard />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.disk')} viewPath="/machine/disk">
            <DiskCard />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.networkOut')} viewPath="/machine/network">
            <NetworkOut />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.networkIn')} viewPath="/machine/network">
            <NetworkIn />
          </DashboardCard>
        </Col>
      </Row>
    </div>;
  }
}

export default connect(mapState, mapDispatch)(MachineDashboard);
