// export default connect(mapState, mapDispatch)(MemoryDetail);
import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';

const mapState = (state: IRootState) => ({
  type: 'memory',
  metricOptions: SUPPORT_METRICS.memory,
  loading: state.loading.effects.machine.asyncGetMemoryStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetMemoryStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
