import React from 'react';
import Icon from '@/components/Icon';
import metadIcon from '@/static/images/Metad-icon60.png';
import graphdIcon from '@/static/images/Graphd-icon60.png';
import storagedIcon from '@/static/images/Storaged-icon60.png';
import { ServiceName } from '@/utils/interface';
import './index.less';

interface IProps {
  serviceType: ServiceName;
  title: string | React.ReactNode;
  icon?: string;
}
class ServiceHeader extends React.PureComponent<IProps> {
  getLogo = () => {
    const { serviceType } = this.props;
    switch (serviceType) {
      case ServiceName.GRAPHD:
        return graphdIcon;
      case ServiceName.STORAGED:
        return storagedIcon;
      case ServiceName.METAD:
        return metadIcon;
      default:
        break;
    }
  };

  render() {
    const { title, icon } = this.props;
    return (
      <div className="service-content-header">
        <div className="flex header-left">
          {!!icon && <Icon className="icon-graph blue" icon={icon} />}
          {!icon && <img src={this.getLogo()} />}
          <span className="title">{title}</span>
        </div>
        <div className="flex">{this.props.children}</div>
      </div>
    );
  }
}

export default ServiceHeader;
