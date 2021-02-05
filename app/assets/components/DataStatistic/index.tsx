import { Select } from 'antd';
import React from 'react';

import './index.less';
import LineChart from '@assets/components/Charts/LineChart';

const { Option } = Select;
interface IProps {
  title: string;
  config?: any; // time select range list
  data: any
}
class DataStatistic extends React.Component<IProps> {

  render () {
    const { title, config } = this.props;
    const _config = config || [{
      label: '过去24小时',
      value: 'day'
    },{
      label: '过去一周',
      value: 'week'
    },{
      label: '过去一个月',
      value: 'month'
    }];
    return (<div className="data-statistics">
      <div className="header">
        <span>{title}</span>
        <div className="select-time">
          <Select defaultValue="过去24小时">
            {_config.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
          </Select>
        </div>
      </div>
      <div className="statistics-content">
        <LineChart />
      </div>
    </div>);
  }
}
export default DataStatistic;