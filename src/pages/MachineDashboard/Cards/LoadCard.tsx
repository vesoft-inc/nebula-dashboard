import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { loadStat, metricsFilterValues } = state.machine;
  const { loadBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: loadBaseLine,
    data: getDataByType({
      data: loadStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.LOAD),
      aliasConfig,
    }),
    valueType: VALUE_TYPE.number,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
