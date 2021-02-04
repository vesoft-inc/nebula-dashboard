import { Select } from 'antd';
import React from 'react'
import intl from 'react-intl-universal';
import LineChart from '@assets/components/Charts/LineChart'

import './index.less'
const { Option } = Select;

interface IProps {
}

interface IState {
}

class ServerMetrics extends React.Component<IProps, IState> {
  render() {
    return (<div className="server-metrics">
      <div className="common-header">
        <span>Graph QPS</span>
        <div className="service-select">
          <div className="select-item">
            <span>{intl.get('common.service')}:</span>
            <Select defaultValue="Graph">
              <Option value="Graph">Graph</Option>
              <Option value="Storage">Storage</Option>
              <Option value="Meta">Meta</Option>
            </Select>
          </div>
          <div className="select-item">
            <span>{intl.get('common.metric')}:</span>
            <Select defaultValue="QPS">
              <Option value="QPS">QPS</Option>
              <Option value="Latency">Latency</Option>
              <Option value="Error">Error</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="btns">
          <Select defaultValue="line">
            <Option value="line">{intl.get('common.lineChart')}</Option>
            <Option value="bar">{intl.get('common.barChart')}</Option>
          </Select>
        </div>
        <div className="chart">
          <LineChart />
        </div>
      </div>
    </div>)
  }
}
export default ServerMetrics