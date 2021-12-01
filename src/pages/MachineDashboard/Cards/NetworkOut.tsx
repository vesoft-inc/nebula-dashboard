import { connect } from 'react-redux';
import { IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType } from '@/utils/dashboard';

const mapState = (state: IRootState) => {
  const { networkOutStat } = state.machine;
  const { networkOutBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkOutBaseLine,
    data: getDataByType({ data:networkOutStat, type:'all', name: 'instance', aliasConfig }),
    valueType: VALUE_TYPE.byteSecond,
    loading: !!state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

export default connect(mapState)(LineCard);