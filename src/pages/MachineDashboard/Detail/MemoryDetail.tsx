// export default connect(mapState, mapDispatch)(MemoryDetail);
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';
import Detail from '.';

const mapState = (state: IRootState) => {
  return {
    type: 'memory',
    dataSource: state.machine.memoryStat,
    metricOptions: SUPPORT_METRICS.memory,
    loading: state.loading.effects.machine.asyncGetMemoryStatByRange,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetMemoryStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);