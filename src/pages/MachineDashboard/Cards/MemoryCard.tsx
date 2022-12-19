import { connect } from 'react-redux';
import LineCard from '@/components/DashboardCard/LineCard';
import { IRootState } from '@/store';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { memoryStat, memorySizeStat, metricsFilterValues } = state.machine;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({
      data: memoryStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.MEMORY),
      aliasConfig,
    }),
    sizes: memorySizeStat,
    valueType: VALUE_TYPE.percentage,
    loading:false,
  };
};

export default connect(mapState)(LineCard);
