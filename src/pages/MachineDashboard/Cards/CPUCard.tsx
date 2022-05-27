import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';

const mapState = (state: IRootState) => {
  const { cpuStat, metricsFilterValues } = state.machine;
  const { cpuBaseLine } = state.setting;
  const { aliasConfig } = state.app;

  return {
    baseLine: cpuBaseLine,
    data: getDataByType({
      data: cpuStat,
      type: metricsFilterValues.instanceList,
      name: 'instance',
      aliasConfig,
    }),
    valueType: VALUE_TYPE.percentage,
    loading: false,
  };
};
export default connect(mapState)(LineCard);
