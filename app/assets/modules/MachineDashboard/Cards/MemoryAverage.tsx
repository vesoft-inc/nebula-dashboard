import { connect } from 'react-redux';
import AverageCard from '@assets/components/DashboardCard/AverageCard';
import { IRootState } from '@assets/store';

const mapState = (state: IRootState) => {
  const { memoryUsageRate } = state.machine;
  let averageUsage = [] as any;
  if (memoryUsageRate.length) {
    averageUsage = memoryUsageRate[0].values.map(([timestamp, _], idx) => {
      const total = memoryUsageRate.reduce((sum, cur) => {
        sum += Number(cur.values[idx][1]);
        return sum;
      }, 0);
      const average = Math.round(total / memoryUsageRate.length);
      return {
        time: timestamp,
        value: average,
        type: 'average-cpu-usage'
      };
    });
  }
  const currentAverageUsage = averageUsage.length ? averageUsage[averageUsage.length - 1].value : 0;

  return {
    averageUsage,
    currentAverageUsage,
    loading: !!state.loading.effects.machine.asyncGetCPUUsageRateByRange,
  };
};

export default connect(mapState)(AverageCard);