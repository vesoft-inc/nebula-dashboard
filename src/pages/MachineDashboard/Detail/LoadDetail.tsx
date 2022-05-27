// export default connect(mapState, mapDispatch)(MemoryDetail);
import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';

const mapState = (state: IRootState) => ({
  type: 'load',
  instances: state.machine.instanceList,
  metricOptions: SUPPORT_METRICS.load,
  metricsFilterValues: state.machine.metricsFilterValues,
  loading: state.loading.effects.machine.asyncGetLoadByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetLoadByRange,
});

export default connect(mapState, mapDispatch)(Detail);
