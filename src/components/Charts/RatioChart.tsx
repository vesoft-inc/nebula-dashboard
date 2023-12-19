import { Chart, registerShape } from '@antv/g2';
import { useEffect, useRef } from 'react';

function RatioChart({
  data,
  title,
  gaps = [100, 100],
}: {
  data: number;
  title?: string;
  gaps?: number[];
}) {
  const chartDomRef = useRef<any>();
  const chartRef = useRef<Chart>();
  useEffect(() => {
    renderChart();
  }, []);
  useEffect(() => {
    const chartData = [{ item: 'online', percent: data }];
    chartRef.current?.changeData(chartData);
  }, [data]);

  const color =
    data > gaps[1] ? '#EB5757' : data > gaps[0] ? '#F2994A' : '#30BF78';
  const renderChart = () => {
    registerShape('point', 'pointer', {
      draw(cfg, container) {
        const group = container.addGroup();
        const width = container.cfg.canvas.cfg.width;
        const center = { x: width / 2, y: 80 }; // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: cfg.x,
            y2: cfg.y,
            stroke: cfg.color,
            lineWidth: 5,
            lineCap: 'round',
          },
        });
        group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 5,
            stroke: cfg.color,
            lineWidth: 1,
            fill: cfg.color,
          },
        });
        return group;
      },
    });
    const chart = new Chart({
      container: chartDomRef.current,
      autoFit: true,
      height: 120,
      width: 120,
      padding: [0, 30, 0, 30],
    });
    chart.data([]);
    chart.axis(false);
    chart.scale('percent', {
      min: 0,
      max: 100,
      tickInterval: 10,
    });
    chart.coordinate('polar', {
      startAngle: (-9 / 8) * Math.PI,
      endAngle: (1 / 8) * Math.PI,
      radius: 0.75,
    });
    chart.legend(false);
    chart.point().position('percent*1').shape('pointer').color(color);

    chart.annotation().arc({
      start: [0, 1],
      end: [gaps[0], 1],
      style: {
        stroke: '#30BF78',
        lineWidth: 20,
        lineDash: null,
      },
    });
    chart.annotation().arc({
      start: [gaps[0], 1],
      end: [gaps[1], 1],
      style: {
        stroke: '#F2994A',
        lineWidth: 20,
        lineDash: null,
      },
    });
    chart.annotation().arc({
      start: [gaps[1], 1],
      end: [100, 1],
      style: {
        stroke: '#EB5757',
        lineWidth: 20,
        lineDash: null,
      },
    });
    chart.annotation().arc({
      start: [0, 1],
      end: [100, 1],
      style: {
        // 底灰色
        stroke: '#CBCBCB',
        lineWidth: 15,
        lineDash: null,
      },
    });
    chart.annotation().arc({
      start: [0, 1],
      end: [data, 1],
      style: {
        stroke: color,
        lineWidth: 15,
        lineDash: null,
      },
    });
    chart.interaction('element-active');
    chart.render();
    chartRef.current = chart;
  };
  return (
    <div className="ratio-chart-demo">
      <div className="ratio-title">{title}</div>
      <div className="ratio-value" style={{ color }}>
        {data}%
      </div>
      <div className="nebula-chart" ref={chartDomRef} />
    </div>
  );
}
export default RatioChart;
