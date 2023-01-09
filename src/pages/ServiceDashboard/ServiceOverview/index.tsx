import React from 'react';
import { Col, Row } from 'antd';
import intl from 'react-intl-universal';
import _ from 'lodash';
import CustomServiceQueryPanel from './CustomServiceQueryPanel';
import ServiceHeader from '@/components/Service/ServiceHeader';
import { IServicePanelConfig, ServiceName } from '@/utils/interface';
import StatusPanel from '@/components/StatusPanel';
import Icon from '@/components/Icon';
import { trackPageView } from '@/utils/stat';
import './index.less';

interface IProps {
  serviceType: ServiceName;
  configs: IServicePanelConfig[];
  onConfigPanel: (serviceType: ServiceName, index: number) => void;
  getStatus: (payload) => void;
  onView: (serviceType: ServiceName) => void;
}

class ServiceOverview extends React.Component<IProps> {
  handleView = () => {
    const { serviceType, onView } = this.props;
    trackPageView(`${serviceType}_metrics`);
    onView(serviceType);
  };

  render() {
    const { serviceType, configs, getStatus } = this.props;
    return (
      <div className="service-table-item">
        <ServiceHeader serviceType={serviceType} title={`${serviceType} ${intl.get('common.service')}`}>
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
                serviceType={serviceType}
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
