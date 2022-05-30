import { connect } from 'react-redux';
import { IRootState } from '@assets/store';
import { VALUE_TYPE } from '@assets/utils/promQL';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';

const mapState = (state: IRootState) => {
  const { networkOutStat } = state.machine;
<<<<<<< HEAD
  const { networkOutBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkOutBaseLine,
=======
  const { aliasConfig, annotationLine } = state.app;
  return {
    baseLineNum: annotationLine.network,
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    data: getDataByType({ data:networkOutStat, type:'all', name: 'instance', aliasConfig }),
    valueType: VALUE_TYPE.byteSecond,
    loading: !!state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

export default connect(mapState)(LineCard);