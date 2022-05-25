import React from 'react';
import Icon from '@/components/Icon';
import metadIcon from '@/static/images/Meta-image.png';
import graphdIcon from '@/static/images/Graphd-image.png';
import storagedIcon from '@/static/images/Storage-image.png';
import './index.less';

interface IProps {
  title: string;
  icon?: string;
}
class ServiceHeader extends React.PureComponent<IProps> {
  getLogo = () => {
    const { title } = this.props;
    switch (title) {
      case 'Graph Service':
        return graphdIcon;
      case 'Storage Service':
        return storagedIcon;
      case 'Meta Service':
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
