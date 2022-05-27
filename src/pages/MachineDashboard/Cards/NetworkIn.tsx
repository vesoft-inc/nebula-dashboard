import { connect } from 'react-redux';
import { IRootState } from '@/store';

import LineCard from '@/components/DashboardCard/LineCard';
import { getDataByType } from '@/utils/dashboard';
import { VALUE_TYPE } from '@/utils/promQL';

const mapState = (state: IRootState) => {
  const { networkInStat, metricsFilterValues } = state.machine;
  const { networkInBaseLine } = state.setting;
  const { aliasConfig } = state.app;
  return {
    baseLine: networkInBaseLine,
    data: getDataByType({
      data: networkInStat,
      type: metricsFilterValues.instanceList,
      name: 'instance',
      aliasConfig,
    }),
    valueType: VALUE_TYPE.byteSecondNet,
    loading: false,
  };
};

export default connect(mapState)(LineCard);
