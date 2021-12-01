import { connect } from 'react-redux';
import LineCard from '@/components/DashboardCard/LineCard';
import { IRootState } from '@/store';
import { getDataByType } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';

const mapState = (state: IRootState) => {
  const { memoryStat, memorySizeStat } = state.machine;
  const { memoryBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({ data:memoryStat, type:'all', name: 'instance', aliasConfig }),
    sizes: memorySizeStat,
    baseLine: memoryBaseLine,
    valueType: VALUE_TYPE.percentage,
    loading: !!state.loading.effects.machine.asyncGetMemorySizeStat &&
      !!state.loading.effects.machine.asyncGetMemoryStatByRange
  };
};

export default connect(mapState)(LineCard);