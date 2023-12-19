import Detail from '.';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

export default () => (
  <Detail 
    // @ts-ignore
    type="load"
    metricOptions={SUPPORT_METRICS.load}
    dataTypeObj={getMetricsUniqName(MetricScene.LOAD)}
  />
);
