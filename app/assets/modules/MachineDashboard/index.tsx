import DashboardCard from '@assets/components/DashboardCard';
import { Col, Row } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import CPUAverage from './Cards/CPUAverage';
import CPUDetail from './Cards/CPUDetail';
import DiskAverage from './Cards/DiskAverage';
import FlowAverage from './Cards/FlowAverage';
import MemoryAverage from './Cards/MemoryAverage';
import './index.less';

class MachineDashboard extends React.Component {
  render() {
    return <div className="machine-dashboard">
      <div className="average-section">
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('dashboard.average.cpu')}>
              <CPUAverage></CPUAverage>
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('dashboard.average.cpu')}>
              <MemoryAverage></MemoryAverage>
            </DashboardCard>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DashboardCard title={intl.get('dashboard.average.cpu')}>
              <DiskAverage></DiskAverage>
            </DashboardCard>
          </Col>
          <Col span={12}>
            <DashboardCard title={intl.get('dashboard.average.flow')}>
              <FlowAverage></FlowAverage>
            </DashboardCard>
          </Col>
        </Row>
      </div>
      <div className="detail-section">
        <Row>
          <Col span={6}>
            <DashboardCard title={intl.get('dashboard.detail.cpu')}>
              <CPUDetail></CPUDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('dashboard.detail.cpu')}>
              <CPUDetail></CPUDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('dashboard.detail.cpu')}>
              <CPUDetail></CPUDetail>
            </DashboardCard>
          </Col>
          <Col span={6}>
            <DashboardCard title={intl.get('dashboard.detail.cpu')}>
              <CPUDetail></CPUDetail>
            </DashboardCard>
          </Col>
        </Row>
      </div>
    </div>
  }
}

export default MachineDashboard;
