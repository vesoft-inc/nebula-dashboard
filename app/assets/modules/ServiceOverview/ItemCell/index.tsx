import { Col, Row } from 'antd'
import React from 'react'
import Icon from '@assets/components/Icon'
import './index.less'
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

  render() {
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
              <span className="green">正常</span>
            </>}
            {status === 'overload' && <>
              <Icon icon="#iconoverload" className="yellow" />
              <span className="yellow">超负荷</span>
            </>}
            {status === 'abnormal' && <>
              <Icon icon="#iconabnormal" className="red" />
              <span className="red">异常</span>
            </>}
          </div>
        </div>
        <div className="chart-item"></div>
        <Row className="chart-data">
          {Object.keys(info).map(label => (
            <Col span="12" key={label}>
              <span className="label">{label}:</span>
              <span className="value">{info[label]}</span>
            </Col>)
          )}
        </Row>
      </div>
    )
  }
}

export default ItemCell