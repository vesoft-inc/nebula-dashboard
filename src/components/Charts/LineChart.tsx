import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Chart, registerInteraction } from '@antv/g2';
import { ChartCfg } from '@antv/g2/lib/interface';

export interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options?: Partial<ChartCfg>;
  baseLine?: number;
}

function LineChart(props: IProps, ref) {
  const { baseLine, options, renderChart } = props;

  const chartRef = useRef<any>();

  const yMin = useRef<number>(0);
  const yMax = useRef<number>(100);

  const chartInstanceRef = useRef<Chart>();

  const renderChartContent = () => {
    if (!chartRef.current) return;
    chartInstanceRef.current = new Chart({
      container: chartRef.current,
      autoFit: true,
      padding: [20, 0, 0, 0],
      ...options,
    });
    registerInteraction('brush', {
      showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
      ],
      start: [
        {
          trigger: 'plot:mousedown',
          action: ['brush-x:start', 'rect-mask:start', 'rect-mask:show'],
        },
      ],
      processing: [
        {
          trigger: 'plot:mousemove',
          action: ['rect-mask:resize'],
        },
      ],
      end: [
        {
          trigger: 'plot:mouseup',
          action: ['brush-x:filter', 'brush:end', 'rect-mask:end', 'rect-mask:hide', 'reset-button:show'],
        },
      ],
      rollback: [{ trigger: 'reset-button:click', action: ['brush:reset', 'reset-button:hide'] }],
    });
    chartInstanceRef.current.interaction('brush');
    if (baseLine) {
      chartInstanceRef.current.annotation().line({
        start: ['min', baseLine],
        end: ['max', baseLine],
        style: {
          stroke: '#e6522b',
          lineWidth: 1,
          lineDash: [3, 3],
        },
      });
    }
    showScaleByBaseLine();
    chartInstanceRef.current.interaction('brush');
    renderChart(chartInstanceRef.current);
    chartInstanceRef.current.render();
  };

  useEffect(() => {
    renderChartContent();
  }, []);

  useEffect(() => {
    updateChart();
  }, [options, baseLine])

  useImperativeHandle(ref, () => ({
    updateBaseline: (baseLine) => {
      updateChart(baseLine);
    },
    updateDetailChart,
  }));

  const updateDetailChart = (
    options: {
      type: string;
      tickInterval: number;
      statSizes?: any;
      maxNum?: number;
      minNum?: number;
    },
  ) => {
    if (!chartInstanceRef.current) return;
    chartInstanceRef.current.scale({
      time: {
        tickInterval: options.tickInterval,
      },
    });
    const { maxNum, minNum } = options
    if (typeof maxNum === 'number' && typeof minNum === 'number') {
      yMin.current = minNum || 0,
      yMax.current = maxNum || 100
      // const tickInterval = ;
      chartInstanceRef.current.scale({
        value: {
          min: yMin.current,
          max: yMax.current,
          tickInterval: Math.round(((maxNum - minNum) / 5)),
        },
      });
    }
    return chartInstanceRef.current;
  };

  const showScaleByBaseLine = (curbaseLine?) => {
    if (!chartInstanceRef.current) return;
    let baseLine = curbaseLine || props.baseLine
    if (baseLine) {
      if (baseLine >= yMax.current) {
        const val = Math.round(baseLine + (yMax.current - yMin.current) / 5);
        chartInstanceRef.current?.scale('value', {
          min: yMin.current,
          max: Math.round(val),
          ticks: [yMin.current, baseLine, Math.round(val)],
        });
      } else if (baseLine <= yMin.current) {
        const val = Math.round(baseLine - (yMax.current - yMin.current) / 5);
        chartInstanceRef.current?.scale('value', {
          min: Math.round(val),
          max: yMax.current,
          ticks: [Math.round(val), baseLine, yMax.current],
        });
      }
    }
  };

  const updateChart = (curbaseLine?) => {
    let baseLine = curbaseLine || props.baseLine
    if (!chartInstanceRef.current) return;
    if (baseLine !== undefined) {
      // HACK: baseLine could be 0
      chartInstanceRef.current?.annotation().clear(true);
      chartInstanceRef.current?.annotation().line({
        start: ['min', baseLine],
        end: ['max', baseLine],
        style: {
          stroke: '#e6522b',
          lineWidth: 1,
          lineDash: [3, 3],
          zIndex: 999,
        },
      });
      showScaleByBaseLine(baseLine);
    }
    // HACK: updateOptions not work, https://github.com/antvis/G2/issues/2844
    if (options) {
      chartInstanceRef.current.padding = options.padding as any;
    }
    // HACK: G2 Chart autoFit don't take effect , refer: https://github.com/antvis/g2/commit/92d607ec5408d1ec949ebd95209c84b04c73b944, but not work
    if (chartInstanceRef.current.height < 100) {
      const e = document.createEvent('Event');
      e.initEvent('resize', true, true);
      window.dispatchEvent(e);
    }
    if (chartRef.current) {
      chartInstanceRef.current.changeSize(chartRef.current.clientWidth, chartRef.current.clientHeight);
    }
    chartInstanceRef.current!.render(true);
  };

  return (
    <div className="nebula-chart nebula-chart-line" ref={ref => chartRef.current = ref} />
  );
}

export default forwardRef(LineChart);
