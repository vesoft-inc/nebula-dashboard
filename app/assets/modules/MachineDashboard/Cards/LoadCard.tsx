import { connect } from 'react-redux';
import { IRootState } from '@assets/store';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';
import { VALUE_TYPE } from '@assets/utils/promQL';

const mapState = (state: IRootState) => {
  const { loadStat } = state.machine;
  return {
    data: getDataByType({ data:loadStat, type:'all', name: 'instance' }),
    valueType: VALUE_TYPE.number,
    loading: !!state.loading.effects.machine.asyncGetLoadByRange,
  };
};

export default connect(mapState)(LineCard);