import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { loadStat, metricsFilterValues, instanceList } = state.machine;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({
      data: loadStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.LOAD),
      aliasConfig,
      instanceList,
    }),
    valueType: VALUE_TYPE.number,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
