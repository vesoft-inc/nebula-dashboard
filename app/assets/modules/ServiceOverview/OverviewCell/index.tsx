import { Col, Row } from 'antd'
import React from 'react'
import Icon from '@assets/components/Icon'
import './index.less'
interface IProps {
  data: {
    normal: number;
    overload: number;
    abnormal: number;
    averageQps: number;
  },
  mode: string;
}
class OverviewCell extends React.PureComponent<IProps> {

  render() {
    const { data: { normal, overload, abnormal, averageQps }, mode } = this.props;
    const totalNum = normal + overload + abnormal;
    return (<div className="service-overview">
      <div className="title">
        <div className="name">
          <Icon icon="#iconservice-status" className={mode} />
          <span>服务状态</span>
        </div>
      </div>
      <div className="flex status-row">
        <div className="status-grid">
          <Row>
            <Col className="bg-green" span={ Math.round(normal / totalNum * 24) }></Col>
            <Col className="bg-yellow" span={ Math.round(overload / totalNum * 24) }></Col>
            <Col className="bg-red" span={ Math.round(abnormal / totalNum * 24) }></Col>
          </Row>
        </div>
        <div className="status-overview">
          <div className="status-item">
            <span className="green status">正常</span>
            <span>{normal}</span>
          </div>
          <div className="status-item">
            <span className="yellow status">超负荷</span>
            <span>{overload}</span>
          </div>
          <div className="status-item">
            <span className="red status">异常</span>
            <span>{abnormal}</span>
          </div>
        </div>
      </div>
      <div className="flex qps-row">
        <div className="chart-qps"></div>
        <div className="qps">
          <span className="qps-header">平均 QPS</span>
          <span className="qps-value">{averageQps}</span>
        </div>
      </div>
    </div>)
  }
}

export default OverviewCell