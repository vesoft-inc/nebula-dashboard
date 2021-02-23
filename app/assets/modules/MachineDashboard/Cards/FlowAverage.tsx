import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Col, Row } from 'antd';
import intl from 'react-intl-universal';

import { IRootState } from '@assets/store';
import { getAdaptiveFlowValue } from '@assets/utils/dashboard';
import './FlowAverage.less';
import Icon from '@assets/components/Icon';

const mapState = (state:IRootState) => {
  const { receiveFlow, transmitFlow } = state.machine;
  let currentAverageReceiveFlow = 0;
  let currentAverageTransmitFlow = 0;
  if (receiveFlow.length) {
    const latestTotal = receiveFlow.reduce((sum, instance) => {
      const latestValues = _.last(instance.values);
      sum += latestValues ? Number(latestValues[1]) : 0;
      return sum;
    }, 0);
    currentAverageReceiveFlow = latestTotal / receiveFlow.length * 8;
  }

  if (transmitFlow.length) {
    const latestTotal = transmitFlow.reduce((sum, instance) => {
      const latestValues = _.last(instance.values);
      sum += latestValues ? Number(latestValues[1]) : 0;
      return sum;
    }, 0);
    currentAverageTransmitFlow = latestTotal / transmitFlow.length * 8;
  }

  return {
    currentAverageReceiveFlow,
    currentAverageTransmitFlow,
  };
};

interface IProps extends ReturnType<typeof mapState> {

}

class FlowAverage extends React.Component<IProps> {

  render () {
    const { currentAverageReceiveFlow, currentAverageTransmitFlow } = this.props;
    const _currentAverageReceiveFlow = getAdaptiveFlowValue(currentAverageReceiveFlow);
    const _currentAverageTransmitFlow = getAdaptiveFlowValue(currentAverageTransmitFlow);
    return (
      <Row className="flow-average average-card">
        <Col span={12}>
          <h4>
            <Icon icon="#iconup" />
            <span>{intl.get('device.average.transmitFlow')}</span>
          </h4>
          <p className="speed">{_currentAverageTransmitFlow.value}</p>
          <p>{_currentAverageTransmitFlow.unit}</p>
        </Col>
        <Col span={12}>
          <h4>
            <Icon icon="#icondown" />
            <span>{intl.get('device.average.receiveFlow')}</span>
          </h4>
          <p className="speed">{_currentAverageReceiveFlow.value}</p>
          <p>{_currentAverageReceiveFlow.unit}</p>
        </Col>
      </Row>
    );
  }
}

export default connect(mapState)(FlowAverage);