import DashboardCard from '@assets/components/DashboardCard';
import { IDispatch } from '@assets/store';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import React from 'react';
import intl from 'react-intl-universal';
import { CARD_POLLING_INTERVAL, CARD_RANGE } from '@assets/utils/dashboard';
import CPUAverage from './Cards/CPUAverage';
import CPUDetail from './Cards/CPUDetail';
import DiskAverage from './Cards/DiskAverage';
import DiskDetail from './Cards/DiskDetail';
import FlowAverage from './Cards/FlowAverage';
import FlowDetail from './Cards/FlowDetail';
import MemoryAverage from './Cards/MemoryAverage';
import MemoryDetail from './Cards/MemoryDetail';
import './index.less';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetCPUUsageRateByRange: dispatch.machine.asyncGetCPUUsageRateByRange,
    asyncGetDiskUsageRateByRange: dispatch.machine.asyncGetDiskUsageRateByRange,
    asyncGetDiskSizeStat: dispatch.machine.asyncGetDiskSizeStat,
    asyncGetMemoryUsageRateByRange: dispatch.machine.asyncGetMemoryUsageRateByRange,
    asyncGetMemorySizeStat: dispatch.machine.asyncGetMemorySizeStat,
    asyncGetFlowByRange: dispatch.machine.asyncGetFlowByRange,
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

  componentDidMount () {
    this.props.asyncGetMemorySizeStat();
    this.props.asyncGetDiskSizeStat();

    this.getMachineStatus();
    this.pollingMachineStatus();
  }

  componentWillUnmount () {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  getMachineStatus = () => {
    const end = Math.round(Date.now() / 1000);
    const start = end - CARD_RANGE;
    this.props.asyncGetCPUUsageRateByRange({
      start,
      end,
    });
    this.props.asyncGetDiskUsageRateByRange({
      start,
      end,
    });
    this.props.asyncGetMemoryUsageRateByRange({
      start,
      end,
    });
    this.props.asyncGetFlowByRange({
      start,
      end,
    });
  }

  pollingMachineStatus = () => {
    this.pollingTimer = setTimeout(() => {
      this.getMachineStatus();
      this.pollingMachineStatus();
    }, CARD_POLLING_INTERVAL);
  }

  render () {
    return <div className="machine-dashboard">
      <div className="average-section">
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('device.average.cpu')} viewPath="/machine-dashboard/cpu" type="average">
              <CPUAverage />
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('device.average.memory')} viewPath="/machine-dashboard/memory" type="average">
              <MemoryAverage />
            </DashboardCard>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('device.average.disk')} viewPath="/machine-dashboard/disk" type="average">
              <DiskAverage />
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('device.average.flow')} viewPath="/machine-dashboard/flow" type="average">
              <FlowAverage />
            </DashboardCard>
          </Col>
        </Row>
      </div>
      <div className="detail-section">
        <Row>
          <Col span={6}>
            <DashboardCard title={intl.get('device.detail.cpu')} viewPath="/machine-dashboard/cpu" type="all">
              <CPUDetail />
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('device.detail.memory')} viewPath="/machine-dashboard/memory" type="all">
              <MemoryDetail />
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('device.detail.disk')} viewPath="/machine-dashboard/disk" type="all">
              <DiskDetail />
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('device.detail.flow')} viewPath="/machine-dashboard/flow" type="all">
              <FlowDetail />
            </DashboardCard>
          </Col>
        </Row>
      </div>
    </div>;
  }
}

export default connect(mapState, mapDispatch)(MachineDashboard);
