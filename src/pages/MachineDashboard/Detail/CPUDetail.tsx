import { connect } from 'react-redux';
import Detail from '.';
import { IDispatch, IRootState } from '@/store';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

const mapState = (state: IRootState) => ({
  type: 'cpu',
  metricOptions: SUPPORT_METRICS.cpu,
  dataTypeObj: getMetricsUniqName(MetricScene.CPU),
  loading: !!state.loading.effects.machine.asyncGetCPUStatByRange,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetDataSourceByRange: dispatch.machine.asyncGetCPUStatByRange,
});

export default connect(mapState, mapDispatch)(Detail);
