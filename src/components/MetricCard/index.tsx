import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import intl from 'react-intl-universal';

import LineCard from '@/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@/utils/promQL';
import { ILineChartMetric, PromResultMetric } from '@/utils/interface';
import { asyncBatchQueries } from '@/requests';
import { calcTimeRange, TIME_OPTION_TYPE } from '@/utils/dashboard';
import { getQueryRangeInfo } from '@/utils';

interface IProps {
  valueType: VALUE_TYPE;
  queries: any;
  timeRange: TIME_OPTION_TYPE | [number, number]
  onChangeBrush?: (brush: any) => void;
  metricTypeFn?: (resultNum: number, refId: string, reusltMetric: PromResultMetric) => string;
}

const MetricCard = forwardRef((props: IProps, ref) => {

  const { valueType, queries, metricTypeFn, timeRange } = props;
  const chartRef = React.useRef();
  const [metricData, setMetricData] = React.useState<ILineChartMetric[]>([]);

  useImperativeHandle(ref, () => (
    {
      chartRef: chartRef.current,
      handleRefresh: () => asyncGetMetricData(queries)
    }
  ), [queries, chartRef.current]);

  const defaultMetricTypeFn = (resultNum: number, refId: string, resultMetric: PromResultMetric) => {
    return resultNum > 1 ? resultMetric.device + intl.get(`metric_description.overview_label.${refId}`) : intl.get(`metric_description.overview_label.${refId}`);
  }

  const asyncGetMetricData = async (queries) => {
    if (queries.length === 0) return;
    const curTimeRange = calcTimeRange(timeRange);
    const { start, end, step } = getQueryRangeInfo(curTimeRange[0], curTimeRange[1]);
    const data: any = await asyncBatchQueries(queries.map(q => ({
      ...q,
      start,
      end,
      step,
    })));
    const { results } = data;
    if (!results) return [];

    const metricData: ILineChartMetric[] = [];
    Object.keys(results).forEach(key => {
      const { result } = results[key];
      result.forEach(r => {
        r.values.forEach(([timestamp, value]) => {
          metricData.push({
            time: timestamp,
            value: Number(value),
            type: metricTypeFn ? metricTypeFn(result.length, key, r.metric) : defaultMetricTypeFn(result.length, key, r.metric),
          })
        })
      })
    })
    setMetricData(metricData);
    return;
  }

  return (
    <LineCard
      data={metricData}
      onChangeBrush={props.onChangeBrush}
      onRef={(ref) => { chartRef.current = ref; }}
      valueType={valueType}
      loading={false}
    />
  )
});

export default MetricCard;