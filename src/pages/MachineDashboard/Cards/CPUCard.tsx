import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { cpuStat, metricsFilterValues } = state.machine;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({
      data: cpuStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.CPU),
      aliasConfig,
    }),
    valueType: VALUE_TYPE.percentage,
    loading: false,
  };
};
export default connect(mapState)(LineCard);
