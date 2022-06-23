import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { IRootState } from '@/store';
import SpaceChart from '@/components/Charts/SpaceChart';
import { DiskMetricInfo } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { diskSizeStat, diskStat, metricsFilterValues } = state.machine;
  const { aliasConfig } = state.app;

  const { instanceList } = metricsFilterValues;
  
  return {
    // According to type, only the detail increases total
    diskUsageDetails: diskStat
      .filter(item => item.metric.instance !== 'total')
      .map((instance, idx) => {
        const latestValues = _.last(instance.values);
        let size = 0;
        if (diskSizeStat[idx]) {
          size = Number(diskSizeStat[idx].value[1]);
        }
        const { instance: name, device, mountpoint } = instance.metric;
        return {
          size,
          name: aliasConfig?.[name] || name,
          used: latestValues ? Number(latestValues[1]) : 0,
          device, 
          mountpoint
        } as DiskMetricInfo;
      }).filter(item => {
        if (instanceList.includes('all')) {
          return true;
        }
        return instanceList.includes(item.name)
      }),
  };
};

interface IProps extends ReturnType<typeof mapState> {}

class DiskCard extends React.Component<IProps> {
  render() {
    const { diskUsageDetails } = this.props;
    return (
      <div className="disk-detail detail-card">
        <SpaceChart diskInfos={diskUsageDetails} />
      </div>
    );
  }
}

export default connect(mapState)(DiskCard);
