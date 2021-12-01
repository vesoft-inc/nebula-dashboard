// export default connect(mapState, mapDispatch)(MemoryDetail);
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';
import Detail from '.';

const mapState = (state: IRootState) => {
  return {
    type: 'load',
    dataSource: state.machine.loadStat,
    metricOptions: SUPPORT_METRICS.load,
    loading: state.loading.effects.machine.asyncGetLoadByRange,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetLoadByRange,
});

export default connect(mapState, mapDispatch)(Detail);