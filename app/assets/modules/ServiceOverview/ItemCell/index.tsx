import { Col, Row } from 'antd';
import React from 'react';
import Icon from '@assets/components/Icon';
import LineChart from '@assets/components/Charts/LineChart';
import intl from 'react-intl-universal';
import './index.less';
interface IProps {
  data: {
    name: string;
    status: string;
    info: {
      qps: number;
      latency: string;
      error: number;
      version: string;
    }
  },
  mode: string;
}
class ItemCell extends React.PureComponent<IProps> {

  render () {
    const { data: { name, status, info }, mode } = this.props;
    return (
      <div
        className={status === 'overload' ? 'service-item overload-item' : status === 'abnormal' ? 'service-item abnormal-item' : 'service-item'}>
        <div className="title">
          <div className="name">
            <Icon icon="#iconservice" className={mode} />
            <span>{name}</span>
          </div>
          <div className="status">
            {status === 'normal' && <>
              <Icon icon="#iconnormal" className="green" />
              <span className="green">{intl.get('service.normal')}</span>
            </>}
            {status === 'overload' && <>
              <Icon icon="#iconoverload" className="yellow" />
              <span className="yellow">{intl.get('service.overload')}</span>
            </>}
            {status === 'abnormal' && <>
              <Icon icon="#iconabnormal" className="red" />
              <span className="red">{intl.get('service.abnormal')}</span>
            </>}
          </div>
        </div>
        <div className="chart-item">
          <LineChart />
        </div>
        <Row className="chart-data">
          {Object.keys(info).map(label => (
            <Col span="12" key={label}>
              <span className="label">{label}:</span>
              <span className="value">{info[label]}</span>
            </Col>)
          )}
        </Row>
      </div>
    );
  }
}

export default ItemCell;