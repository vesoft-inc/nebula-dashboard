import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@assets/store';
import { SUPPORT_METRICS } from '@assets/utils/promQL';
import Detail from '.';

const mapState = (state: IRootState) => {
  return {
    type: 'cpu',
    dataSource: state.machine.cpuStat,
    metricOptions: SUPPORT_METRICS.cpu,
    loading: !!state.loading.effects.machine.asyncGetCPUStatByRange,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetCPUStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);