import DashboardCard from '@assets/components/DashboardCard';
import { Col, Row } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import CPUAverage from './Cards/CPUAverage';
import CPUDetail from './Cards/CPUDetail';
import DiskAverage from './Cards/DiskAverage';
import DiskDetail from './Cards/DiskDetail';
import FlowAverage from './Cards/FlowAverage';
import FlowDetail from './Cards/FlowDetail';
import MemoryAverage from './Cards/MemoryAverage';
import MemoryDetail from './Cards/MemoryDetail';
import './index.less';

class MachineDashboard extends React.Component {
  render() {
    return <div className="machine-dashboard">
      <div className="average-section">
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('deivce.average.cpu')} viewPath="/machine-dashboard/cpu">
              <CPUAverage></CPUAverage>
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('deivce.average.memory')} viewPath="/machine-dashboard/memory">
              <MemoryAverage></MemoryAverage>
            </DashboardCard>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('deivce.average.disk')} viewPath="/machine-dashboard/disk">
              <DiskAverage></DiskAverage>
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('deivce.average.flow')} viewPath="/machine-dashboard/flow">
              <FlowAverage></FlowAverage>
            </DashboardCard>
          </Col>
        </Row>
      </div>
      <div className="detail-section">
        <Row>
          <Col span={6}>
            <DashboardCard title={intl.get('deivce.detail.cpu')} viewPath="/machine-dashboard/cpu">
              <CPUDetail></CPUDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('deivce.detail.memory')} viewPath="/machine-dashboard/memory">
              <MemoryDetail></MemoryDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('deivce.detail.disk')} viewPath="/machine-dashboard/disk">
              <DiskDetail></DiskDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('deivce.detail.flow')} viewPath="/machine-dashboard/flow">
              <FlowDetail></FlowDetail>
            </DashboardCard>
          </Col>
        </Row>
      </div>
    </div>
  }
}

export default MachineDashboard;
