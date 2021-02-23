import SpaceChart from '@assets/components/Charts/SpaceChart';
import { IRootState } from '@assets/store';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const mapState = (state: IRootState) => {
  const { memoryUsageRate, memorySizeStat } = state.machine;
  return {
    memoryUsageDetail: memoryUsageRate.map((instance, idx) => {
      const latestValues = _.last(instance.values);
      const size = memorySizeStat.length ? memorySizeStat[idx].value[1] : 0;

      return  {
        size,
        type: instance.metric.instance,
        value: latestValues ? Number(latestValues[1]) : 0
      };
    })

  };
};

interface IProps extends ReturnType<typeof mapState> {

}

class MemoryDetail extends React.Component<IProps> {
  render () {
    const { memoryUsageDetail } = this.props;
    return (
      <div className="cpu-detail detail-card">
        <SpaceChart data={memoryUsageDetail} />
      </div>
    );
  }
}

export default connect(mapState)(MemoryDetail);