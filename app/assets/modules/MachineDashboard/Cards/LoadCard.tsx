import { connect } from 'react-redux';
import { IRootState } from '@assets/store';

import LineCard from '@assets/components/DashboardCard/LineCard';
import { getDataByType } from '@assets/utils/dashboard';
import { VALUE_TYPE } from '@assets/utils/promQL';

const mapState = (state: IRootState) => {
  const { loadStat } = state.machine;
<<<<<<< HEAD
  const { loadBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: loadBaseLine,
=======
  const { aliasConfig, annotationLine } = state.app;
  return {
    baseLineNum: annotationLine.load,
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    data: getDataByType({ data:loadStat, type:'all', name: 'instance', aliasConfig }),
    valueType: VALUE_TYPE.number,
    loading: !!state.loading.effects.machine.asyncGetLoadByRange,
  };
};

export default connect(mapState)(LineCard);