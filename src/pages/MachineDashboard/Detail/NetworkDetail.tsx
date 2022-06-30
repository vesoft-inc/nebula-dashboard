import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => ({
  type: 'network',
  metricOptions: SUPPORT_METRICS.network,
  dataTypeObj: getMetricsUniqName(MetricScene.NETWORK),
  loading: state.loading.effects.machine.asyncGetNetworkStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetNetworkStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
