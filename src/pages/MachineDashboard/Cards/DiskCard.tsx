import { IRootState } from '@/store';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SpaceChart from '@/components/Charts/SpaceChart';

const mapState = (state: IRootState) => {
  const { diskSizeStat, diskStat } = state.machine;
  const { aliasConfig } = state.app;
  
  return {
    // According to type, only the detail increases total
    diskUsageDetail: diskStat.filter(item => item.metric.instance !== 'total').map((instance, idx) => {
      const latestValues = _.last(instance.values);
      let size = 0;
      if (diskSizeStat[idx]) {
        size = Number(diskSizeStat[idx].value[1]);
      }
      const name = instance.metric.instance;
      return {
        size,
        type: aliasConfig[name] || name,
        value: latestValues ? Number(latestValues[1]) : 0,
      };
    })
  };
};

interface IProps extends ReturnType<typeof mapState> {

}

class DiskCard extends React.Component<IProps> {
  render() {
    const { diskUsageDetail } = this.props;
    return (
      <div className="disk-detail detail-card">
        <SpaceChart data={diskUsageDetail} />
      </div>
    );
  }
}

export default connect(mapState)(DiskCard);