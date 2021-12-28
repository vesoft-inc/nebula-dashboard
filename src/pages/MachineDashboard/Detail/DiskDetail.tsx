// export default connect(mapState, mapDispatch)(Detail);
import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';

const mapState = (state: IRootState) => {
  return {
    type: 'disk',
    dataSource: state.machine.diskStat,
    metricOptions: SUPPORT_METRICS.disk,
    loading: state.loading.effects.machine.asyncGetDiskStatByRange,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetDiskStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);