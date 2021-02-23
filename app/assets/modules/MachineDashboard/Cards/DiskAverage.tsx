import { connect } from 'react-redux';
import { IRootState } from '@assets/store';
import AverageCard from '@assets/components/DashboardCard/AverageCard';

const mapDispatch = () => ({

});

const mapState = (state: IRootState) => {
  const { diskUsageRate } = state.machine;
  let averageUsage = [] as any;
  if (diskUsageRate.length) {
    averageUsage = diskUsageRate[0].values.map(([timestamp, _], idx) => {
      const total = diskUsageRate.reduce((sum, cur) => {
        sum += Number(cur.values[idx][1]);
        return sum;
      }, 0);
      const average = Math.round(total / diskUsageRate.length);

      return {
        time: timestamp,
        value: average,
        type: 'average-disk-usage'
      };
    });
  }

  const currentAverageUsage = averageUsage.length ? averageUsage[averageUsage.length - 1].value : 0;

  return {
    averageUsage,
    currentAverageUsage,
    loading: !!state.loading.effects.machine.asyncGetDiskUsageRateByRange
  };
};



export default connect(mapState, mapDispatch)(AverageCard);