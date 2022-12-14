import React, { useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';
import { Spin } from 'antd';
import LineChart from '@/components/Charts/LineChart';
import { ILineChartMetric, IStatSingleItem, ServiceName } from '@/utils/interface';
import { VALUE_TYPE } from '@/utils/promQL';
import { getMaxNum, getMaxNumAndLength, getMinNum, getProperStep, getTickIntervalByGap } from '@/utils/dashboard';

interface IProps {
  data: ILineChartMetric[];
  valueType: VALUE_TYPE;
  sizes?: IStatSingleItem[];
  loading: boolean;
  baseLine?: number;
}

function LineCard(props: IProps) {
  const chartRef = useRef<any>();

  const { loading, data = [], valueType, sizes, baseLine } = props;
  useEffect(() => {
    if (!loading && chartRef.current) {
      updateChart();
    }
  }, [loading, chartRef.current]);

  useEffect(() => {
    if (baseLine != undefined && chartRef.current) {
      chartRef.current.updateBaseline(baseLine);
    }
  }, [baseLine, chartRef.current]);

  const renderLineChart = () => {
    chartRef.current.configDetailChart({
      valueType,
      sizes,
      isCard: true,
    });
    updateChart();
  };

  const updateChart = () => {
    const realRange = data.length > 0 ? (data[data.length - 1].time - data[0].time) : 0;
    const gap = Math.floor(realRange / 10); // 10 ticks max
    const tickInterval = getTickIntervalByGap(gap);
    chartRef.current.updateDetailChart({
      maxNum: getMaxNum(data),
      minNum: getMinNum(data),
      tickInterval,
      valueType,
    }).changeData(data);
  };

  const maxNumLen = useMemo(() => {
    const { maxNumLen } = getMaxNumAndLength({
      data,
      valueType,
      baseLine,
    })
    return maxNumLen;
  }, [data, valueType, baseLine])

  return (
    loading ? <Spin /> : (
    <LineChart
      renderChart={renderLineChart}
      ref={ref => chartRef.current = ref}
      options={{ padding: [20, 20, 60, 6 * maxNumLen + 30] }}
    />)
  );
}

export default LineCard;
