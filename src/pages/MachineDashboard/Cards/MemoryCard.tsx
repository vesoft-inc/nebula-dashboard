import { connect } from 'react-redux';
import LineCard from '@/components/DashboardCard/LineCard';
import { IRootState } from '@/store';
import { getDataByType } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';

const mapState = (state: IRootState) => {
  const { memoryStat, memorySizeStat, metricsFilterValues } = state.machine;
  const { memoryBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({
      data: memoryStat,
      type: metricsFilterValues.instanceList,
      name: 'instance',
      aliasConfig,
    }),
    sizes: memorySizeStat,
    baseLine: memoryBaseLine,
    valueType: VALUE_TYPE.percentage,
    loading:false,
  };
};

export default connect(mapState)(LineCard);
