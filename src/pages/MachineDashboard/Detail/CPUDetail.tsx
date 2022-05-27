import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';

const mapState = (state: IRootState) => ({
  type: 'cpu',
  metricOptions: SUPPORT_METRICS.cpu,
  loading: !!state.loading.effects.machine.asyncGetCPUStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetCPUStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
