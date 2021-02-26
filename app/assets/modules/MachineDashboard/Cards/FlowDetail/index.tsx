import React from 'react';
import { IRootState } from '@assets/store';
import { connect } from 'react-redux';
import { last } from 'lodash';
import FlowLineChart from '../../Cards/FlowDetail/FlowLineChart';

const mapState = (state: IRootState) => {
  const { receiveFlow, transmitFlow } = state.machine;
  const flowStat = {} as any;
  const latestReceiveFlows = {};
  const latestTransmitFlows = {};

  if (receiveFlow.length) {
    receiveFlow.forEach(instance => {
      flowStat[instance.metric.instance] = instance.values.map(([timestamps, value]) => {
        return {
          time: timestamps,
          value: Number(value) * 8,
          type: instance.metric.instance + '-transmit-flow',
        };
      });
      const [ timestamps, value ] = last(instance.values) || [ 0, 0];
      latestReceiveFlows[instance.metric.instance] = {
        time: timestamps,
        value: Number(value) * 8,
        type: instance.metric.instance + '-transmit-flow',
      };
    });
  }

  if (transmitFlow.length) {
    transmitFlow.forEach(instance => {
      flowStat[instance.metric.instance] = flowStat[instance.metric.instance] || [];
      flowStat[instance.metric.instance] = flowStat[instance.metric.instance].concat(instance.values.map(([timestamps, value]) => {
        return {
          time: timestamps,
          value: Number(value) * 8,
          type: instance.metric.instance + '-receive-flow',
        };
      }));
      const [ timestamps, value ] = last(instance.values) || [0, 0];
      latestTransmitFlows[instance.metric.instance] =  {
        time: timestamps,
        value: Number(value) * 8,
        type: instance.metric.instance + '-receive-flow'
      };
    });
  }

  return {
    flowStat,
    latestReceiveFlows,
    latestTransmitFlows,
  };
};

interface IProps extends ReturnType<typeof mapState> {

}

class FlowDetail extends React.Component<IProps> {
  render () {
    const { flowStat, latestReceiveFlows, latestTransmitFlows } = this.props;

    return <div className="flow-detail detail-card">
      {
        Object.keys(flowStat).map(instance => (
          <FlowLineChart latestTransmitFlow={latestTransmitFlows[instance]} latestReceiveFlow={latestReceiveFlows[instance]} flowData={flowStat[instance]} key={instance} />
        ))
      }
    </div>;
  }
}

export default connect(mapState)(FlowDetail);