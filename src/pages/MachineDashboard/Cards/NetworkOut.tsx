import { connect } from 'react-redux';
import { IRootState } from '@/store';
import { VALUE_TYPE } from '@/utils/promQL';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType, getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => {
  const { networkOutStat, metricsFilterValues, instanceList } = state.machine;
  const { aliasConfig } = state.app;
  return {
    data: getDataByType({
      data: networkOutStat,
      type: metricsFilterValues.instanceList,
      nameObj: getMetricsUniqName(MetricScene.NETWORK),
      aliasConfig,
      instanceList,
    }),
    valueType: VALUE_TYPE.byteSecondNet,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
