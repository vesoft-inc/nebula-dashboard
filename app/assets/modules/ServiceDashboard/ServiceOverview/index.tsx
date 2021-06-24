import { Col, Row } from 'antd';
import React from 'react';
import ServiceHeader from '@assets/components/Service/ServiceHeader';
import { IServicePanelConfig } from '@assets/utils/interface';
import StatusPanel from '@assets/components/StatusPanel';
import Icon from '@assets/components/Icon';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { trackPageView } from '@assets/utils/stat';
import intl from 'react-intl-universal';
import _ from 'lodash';
<<<<<<< HEAD:app/assets/modules/ServiceDashboard/ServiceOverview/index.tsx
import CustomServiceQueryPanel from './CustomServiceQueryPanel';
=======
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55)):app/assets/components/Service/ServiceOverview/index.tsx
import './index.less';

interface IProps extends RouteComponentProps {
  serviceType: string;
  icon: string;
  configs: IServicePanelConfig[],
  baseLineNum?:number,
  onConfigPanel: (serviceType: string, index: number)=>void;
  getStatus: (payload)=> void;
}

class ServiceOverview extends React.PureComponent<IProps> {
  handleView = () => {
    const { serviceType } = this.props;
    trackPageView(`${serviceType}_metrics`);
    this.props.history.push(`/service/${serviceType}-metrics`);
  }

  render() {
    const { 
      serviceType, 
      icon, 
      configs,
<<<<<<< HEAD:app/assets/modules/ServiceDashboard/ServiceOverview/index.tsx
      getStatus,
=======
      baseLineNum
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55)):app/assets/components/Service/ServiceOverview/index.tsx
    } = this.props;
    return (
      <div className="service-table-item">
        <ServiceHeader 
          title={`${serviceType} Service`}
          icon={icon}
        >
          <StatusPanel type={serviceType} getStatus={getStatus}/>
          <div className="btn-icon-with-desc blue" onClick={this.handleView}>
            <Icon icon="#iconwatch" />
            <span>{intl.get('common.view')}</span>
          </div>
        </ServiceHeader>
        <Row>
          {configs.map((config, index) => <Col span={12} key={index}>
            <CustomServiceQueryPanel 
              config={config}
              baseLineNum={baseLineNum}
              onConfigPanel={() => this.props.onConfigPanel(serviceType, index)}
            />
          </Col>)}
        </Row>
      </div>
    );
  }
}

export default withRouter(ServiceOverview);