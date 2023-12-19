import Detail from '.';
import { SUPPORT_METRICS } from '@/utils/promQL';
import { getMetricsUniqName } from '@/utils/dashboard';
import { MetricScene } from '@/utils/interface';

export default () => (
  <Detail 
    // @ts-ignore
    type="network"
    metricOptions={SUPPORT_METRICS.network}
    dataTypeObj={getMetricsUniqName(MetricScene.NETWORK)}
  />
);
