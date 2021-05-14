import { connect } from 'react-redux';
import { IRootState } from '@assets/store';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';
import { VALUE_TYPE } from '@assets/utils/promQL';

const mapState = (state: IRootState) => {
  const { networkInStat } = state.machine;
  return {
    data: getDataByType({ data:networkInStat, type:'all', name: 'instance' }),
    valueType: VALUE_TYPE.byteSecond,
    loading: !!state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

export default connect(mapState)(LineCard);