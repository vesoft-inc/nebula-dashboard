import { useEffect, useRef } from 'react';
import _ from 'lodash';
import { Spin } from 'antd';
import LineChart from '@/components/Charts/LineChart';
import { ILineChartMetric } from '@/utils/interface';
import { VALUE_TYPE } from '@/utils/promQL';
import { getMaxNum, getMinNum, getTickIntervalByGap } from '@/utils/dashboard';
import { FilterCondition } from '@antv/g2/lib/interface';

interface IProps {
  data: ILineChartMetric[];
  valueType: VALUE_TYPE;
  loading?: boolean;
  baseLine?: number;
  timeRange?: [number, number];
  onChangeBrush?: (range: FilterCondition | null) => void;
  onRef?: (ref: any) => void;
}

function LineCard(props: IProps) {
  const chartRef = useRef<any>();

  const { loading, data = [], valueType, baseLine, timeRange } = props;
  useEffect(() => {
    if (!loading && chartRef.current) {
      updateChart();
    }
  }, [loading, chartRef.current]); 

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.updateBaseline(baseLine);
    }
  }, [baseLine, chartRef.current]);

  const renderLineChart = () => {
    chartRef.current.configDetailChart({
      valueType,
      isCard: true,
    });
    updateChart();
  };

  useEffect(() => {
    chartRef.current?.configDetailChart({
      valueType,
      isCard: true,
    });
    updateChart();
  }, [valueType]);

  const updateChart = () => {
    const realRange = data.length > 0 ? (data[data.length - 1].time - data[0].time) : 0;
    const gap = Math.floor(realRange / 10); // 10 ticks max
    const tickInterval = getTickIntervalByGap(gap);
    chartRef.current.updateDetailChart({
      maxNum: getMaxNum(data),
      minNum: getMinNum(data),
      tickInterval,
      valueType,
      startTime: timeRange?.[0],
      endTime: timeRange?.[1]
    }).changeData(data);
  };

  return (
    loading ? <Spin /> : (
    <LineChart
      onChangeBrush={props.onChangeBrush}
      renderChart={renderLineChart}
      ref={(ref) => {
        chartRef.current = ref;
        props.onRef && props.onRef(ref);
      }}
      options={{ padding: [20, 20, 60, 60] }}
    />)
  );
}

export default  LineCard;
