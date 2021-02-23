import { DETAIL_DEFAULT_RANGE } from '@assets/utils/dashboard';
import { Select } from 'antd';
import React, { HTMLProps } from 'react';
import intl from 'react-intl-universal';

import './index.less';

const Option = Select.Option;

interface IProps extends HTMLProps<any> {
  children: any;
  onIntervalChange?: (timestamps:number) => void
  interval?: number,
  title?: string;
  typeOptions?: any[]
  currentType?: string,
  onTypeChange?: (type: string) => void
}

class DashboardDetail extends React.PureComponent<IProps> {
  render () {
    const { title, children, onIntervalChange, interval = DETAIL_DEFAULT_RANGE, typeOptions, currentType, onTypeChange } = this.props;
    const timeOptions = [
      {
        name: intl.get('component.dashboardDetail.pastHour'),
        value: 60 * 60,
      },
      {
        name: intl.get('component.dashboardDetail.pastDay'),
        value: 24 * 60 * 60,
      }
    ];

    return <div className="dashboard-detail">
      <div className="title">
        <h3>{title}</h3>
        {
          typeOptions && (<Select value={currentType} onChange={onTypeChange}>
            {
              typeOptions.map(option => <Option value={option.value} key={option.value}>{option.name}</Option>)
            }
          </Select>)
        }
        <Select onChange={onIntervalChange} value={interval}>
          {
            timeOptions.map(o => <Option value={o.value} key={o.value}>{o.name}</Option>)
          }
        </Select>
      </div>
      <div className="detail-content">
        {children}
      </div>
    </div>;
  }
}

export default DashboardDetail;