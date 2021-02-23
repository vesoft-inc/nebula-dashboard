import { IRootState } from '@assets/store';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SpaceChart from '@assets/components/Charts/SpaceChart';

const mapDispatch = () => ({
});

const mapState = (state: IRootState) => {
  return {
    cpuUsageDetail: state.machine.cpuUsage.map(instance => {
      const latestValues = _.last(instance.values);

      return {
        type: instance.metric.instance,
        value: latestValues ? Number(latestValues[1]) : 0
      };
    })
  };
};

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {

}

class CPUDetail extends React.Component<IProps> {
  render () {
    const { cpuUsageDetail  } = this.props;
    return (
      <div className="cpu-detail detail-card">
        <SpaceChart data={cpuUsageDetail} />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(CPUDetail);