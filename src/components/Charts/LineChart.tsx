import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Chart, registerAction, registerInteraction } from '@antv/g2';
import { ChartCfg } from '@antv/g2/lib/interface';

export interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options?: Partial<ChartCfg>;
  tickInterval?: number;
  baseLine?: number;
  yAxisMaximum?: number;
  isDefaultScale?: boolean;
}

function LineChart(props: IProps, ref) {
  const { isDefaultScale, yAxisMaximum, baseLine, tickInterval, options, renderChart } = props;

  const chartRef = useRef<any>();

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
    updateChart: (baseLine) => {
      updateChart(baseLine);
    },
  }))

  const showScaleByBaseLine = (curbaseLine?) => {
    let baseLine = curbaseLine || props.baseLine
    if (isDefaultScale) {
      chartInstanceRef.current?.scale({
        value: {
          min: 0,
          max: 100,
          tickInterval: 25,
        },
      });
    } else if (yAxisMaximum === 0 && baseLine) {
      chartInstanceRef.current?.scale('value', {
        ticks: [0, baseLine, Math.round(baseLine * 1.5)],
      });
    } else {
      chartInstanceRef.current?.scale('value', { ticks: [] }); // If yAxisMaximum is not 0, you do not need to set scale
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
    chartInstanceRef.current!.render(true);
  };

  return (
    <div className="nebula-chart nebula-chart-line" ref={ref => chartRef.current = ref} />
  );
}

export default forwardRef(LineChart);
