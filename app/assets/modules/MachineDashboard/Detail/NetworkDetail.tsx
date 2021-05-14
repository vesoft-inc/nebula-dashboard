import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@assets/store';
import { SUPPORT_METRICS } from '@assets/utils/promQL';
import Detail from '.';

const mapState = (state: IRootState) => {
  return {
    type: 'network',
    dataSource: state.machine.networkStat,
    metricOptions: SUPPORT_METRICS.network,
    loading: state.loading.effects.machine.asyncGetNetworkStatByRange,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetNetworkStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);