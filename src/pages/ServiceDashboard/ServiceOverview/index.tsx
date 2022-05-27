import { Col, Row } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import _ from 'lodash';
import CustomServiceQueryPanel from './CustomServiceQueryPanel';
import ServiceHeader from '@/components/Service/ServiceHeader';
import { IServicePanelConfig } from '@/utils/interface';
import StatusPanel from '@/components/StatusPanel';
import Icon from '@/components/Icon';
import { trackPageView } from '@/utils/stat';
import './index.less';

interface IProps {
  serviceType: string;
  icon: string;
  configs: IServicePanelConfig[];
  onConfigPanel: (serviceType: string, index: number) => void;
  getStatus: (payload) => void;
  onView: (serviceType: string) => void;
}

class ServiceOverview extends React.Component<IProps> {
  handleView = () => {
    const { serviceType, onView } = this.props;
    trackPageView(`${serviceType}_metrics`);
    onView(serviceType);
  };

  render() {
    const { serviceType, icon, configs, getStatus } = this.props;
    return (
      <div className="service-table-item">
        <ServiceHeader title={`${serviceType} Service`} icon={icon}>
          <StatusPanel type={serviceType} getStatus={getStatus} />
          <div className="btn-icon-with-desc blue" onClick={this.handleView}>
            <Icon icon="#iconwatch" />
            <span>{intl.get('common.view')}</span>
          </div>
        </ServiceHeader>
        <Row>
          {configs.map((config, index) => (
            <Col span={12} key={index}>
              <CustomServiceQueryPanel
                config={config}
                onConfigPanel={() =>
                  this.props.onConfigPanel(serviceType, index)
                }
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default ServiceOverview;
