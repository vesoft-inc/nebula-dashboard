import { connect } from 'react-redux';
import { IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { networkOutStat, metricsFilterValues } = state.machine;
  const { networkOutBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkOutBaseLine,
    data: getDataByType({
      data: networkOutStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.NETWORK),
      aliasConfig,
    }),
    valueType: VALUE_TYPE.byteSecondNet,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
