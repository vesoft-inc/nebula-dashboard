// export default connect(mapState, mapDispatch)(Detail);
import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => ({
  type: 'disk',
  instances: state.machine.instanceList,
  metricOptions: SUPPORT_METRICS.disk,
  dataTypeObj: getMetricsUniqName(MetricScene.MACHINE),
  metricsFilterValues: state.machine.metricsFilterValues,
  loading: state.loading.effects.machine.asyncGetDiskStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetDiskStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
