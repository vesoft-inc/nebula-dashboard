import { connect } from 'react-redux';
import LineCard from '@assets/components/DashboardCard/LineCard';
import { IRootState } from '@assets/store';
import { getDataByType } from '@assets/utils/dashboard';
import { VALUE_TYPE } from '@assets/utils/promQL';

const mapState = (state: IRootState) => {
  const { memoryStat, memorySizeStat } = state.machine;
  const { aliasConfig, annotationLine } = state.app;
  console.log(annotationLine.memory);
  return {
    data: getDataByType({ data:memoryStat, type:'all', name: 'instance', aliasConfig }),
    sizes: memorySizeStat,
    lineNum: annotationLine.memory,
    valueType: VALUE_TYPE.percentage,
    loading: !!state.loading.effects.machine.asyncGetMemorySizeStat &&
      !!state.loading.effects.machine.asyncGetMemoryStatByRange
  };
};

export default connect(mapState)(LineCard);