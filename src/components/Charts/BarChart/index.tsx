import { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options: any;
}

function BarChart(props: IProps) {

  const { renderChart, options={} } = props;

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

    renderChart(chartInstanceRef.current);
    // HACK: G2 Chart autoFit don't take effect , refer: https://github.com/antvis/g2/commit/92d607ec5408d1ec949ebd95209c84b04c73b944, but not work
    if (chartInstanceRef.current.height < 100) {
      const e = document.createEvent('Event');
      e.initEvent('resize', true, true);
      window.dispatchEvent(e);
    }
    chartInstanceRef.current!.render(true);
  }

  useEffect(() => {
    renderChartContent();
  }, [chartRef.current]);

  return (
    <div
      className="nebula-chart nebula-chart-bar"
      style={{ textAlign: 'center' }}
      ref={ref => chartRef.current = ref}
    />
  )
}

export default BarChart;