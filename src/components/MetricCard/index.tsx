import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import intl from 'react-intl-universal';

import LineCard from '@/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@/utils/promQL';
import { ILineChartMetric } from '@/utils/interface';

interface IProps {
  asyncBatchQueries: (queries: []) => Promise<any>;
  valueType: VALUE_TYPE;
  queries: any;
}

const MetricCard = forwardRef((props: IProps, ref) => {

  const { asyncBatchQueries, valueType, queries } = props;

  const [metricData, setMetricData] = React.useState<ILineChartMetric[]>([]);

  useImperativeHandle(ref, () => (
    {
      handleRefresh: () => asyncGetMetricData(queries)
    }
  ),[queries]);

  const asyncGetMetricData = async (queries) => {
    const data = await asyncBatchQueries(queries);
    const { results } = data;

    const metricData: ILineChartMetric[] = [];
    Object.keys(results).forEach(key => {
      const { result } = results[key]; 
      result.forEach(r => {
        r.values.forEach(([timestamp, value]) => {
          metricData.push({
            time: timestamp,
            value: Number(value),
            type: result.length > 1 ? r.metric.device + intl.get(`metric_description.${key}`) : intl.get(`metric_description.${key}`),
          })
        })
      })
    })
    setMetricData(metricData);
    return ;
  }

  return (
    <LineCard  
      data={metricData}
      valueType={valueType}
      loading={false}
    />
  )
});

export default MetricCard;