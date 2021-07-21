import { connect } from 'react-redux';
import { IRootState } from '@assets/store';
import { VALUE_TYPE } from '@assets/utils/promQL';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';

const mapState = (state: IRootState) => {
  const { networkOutStat, networkOutBaseLine } = state.machine;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkOutBaseLine,
    data: getDataByType({ data:networkOutStat, type:'all', name: 'instance', aliasConfig }),
    valueType: VALUE_TYPE.byteSecond,
    loading: !!state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

export default connect(mapState)(LineCard);