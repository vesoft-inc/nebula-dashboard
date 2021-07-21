import { connect } from 'react-redux';
import { IRootState } from '@assets/store';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';
import { VALUE_TYPE } from '@assets/utils/promQL';

const mapState = (state: IRootState) => {
  const { cpuStat, cpuBaseLine } = state.machine;
  const { aliasConfig } = state.app;
  return {
    baseLine:cpuBaseLine,
    data: getDataByType({ data:cpuStat, type:'all', name: 'instance', aliasConfig }),
    valueType: VALUE_TYPE.percentage,
    loading: !!state.loading.effects.machine.asyncGetCPUStatByRange,
  };
};
export default connect(mapState)(LineCard);