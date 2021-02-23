import { connect } from 'react-redux';
import { IRootState } from '@assets/store';

import AverageCard from '@assets/components/DashboardCard/AverageCard';
import { getAverageStat } from '@assets/utils/dashboard';


const mapState = (state: IRootState) => {
  const { cpuUsage } = state.machine;
  const averageUsage = getAverageStat(cpuUsage, 'cpu-average-usage');
  const currentAverageUsage = averageUsage.length ? averageUsage[averageUsage.length - 1].value : 0;

  return {
    averageUsage,
    currentAverageUsage,
    loading: !!state.loading.effects.machine.asyncGetCPUUsageRateByRange,
  };
};

export default  connect(mapState)(AverageCard);