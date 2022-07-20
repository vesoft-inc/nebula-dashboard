import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { networkInStat, metricsFilterValues } = state.machine;
  const { networkInBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkInBaseLine,
    data: getDataByType({
      data: networkInStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.NETWORK),
      aliasConfig,
    }),
    valueType: VALUE_TYPE.byteSecondNet,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
