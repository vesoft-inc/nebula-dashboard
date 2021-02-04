import { Select } from 'antd';
import React, { HTMLProps } from 'react';
import intl from 'react-intl-universal'

import './index.less';

const Option = Select.Option;

interface IProps extends HTMLProps<any> {
  children: any;
  onIntervalChange?: (timestamps:number) => void
  initialInterval?: number,
  title?: string;
}

class DashboardDetail extends React.PureComponent<IProps> {
  render() {
    const { title, children, onIntervalChange, initialInterval = 60 * 60 * 1000 } = this.props;
    const timeOptions = [
      {
        name: intl.get('component.dashboardDetail.pastHour'),
        value: 60 * 60 * 1000,
      },
      {
        name: intl.get('component.dashboardDetail.pastDay'),
        value: 24 * 60 * 60 * 1000,
      }
    ]
    return <div className="dashboard-detail">
      <div className="title">
        <h3>{title}</h3>
        <Select onChange={onIntervalChange} value={initialInterval}>
          {
            timeOptions.map(o => <Option value={o.value} key={o.value}>{o.name}</Option>)
          }
        </Select>
      </div>
      <div className="detail-content">
        {children}
      </div>
    </div>
  }
}

export default DashboardDetail