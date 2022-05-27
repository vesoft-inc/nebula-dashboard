import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';

const mapState = (state: IRootState) => ({
  type: 'network',
  metricOptions: SUPPORT_METRICS.network,
  loading: state.loading.effects.machine.asyncGetNetworkStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetNetworkStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
