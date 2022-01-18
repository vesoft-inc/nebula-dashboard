import React from 'react';
import Icon from '@/components/Icon';
import './index.less';

interface IProps {
  title: string;
  icon: string;
}
class ServiceHeader extends React.PureComponent<IProps> {
  render() {
    const { title, icon } = this.props;
    return (
      <div className="service-content-header">
        <div className="flex header-left">
          <Icon className="icon-graph blue" icon={icon} />
          <span className="title">{title}</span>
        </div>
        <div className="flex">{this.props.children}</div>
      </div>
    );
  }
}

export default ServiceHeader;
