import { connect } from 'react-redux';
import { IRootState } from '@assets/store';
import { VALUE_TYPE } from '@assets/utils/promQL';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';

const mapState = (state: IRootState) => {
  const { networkOutStat } = state.machine;
  return {
    data: getDataByType({ data:networkOutStat, type:'all', name: 'instance' }),
    valueType: VALUE_TYPE.byteSecond,
    loading: !!state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

export default connect(mapState)(LineCard);