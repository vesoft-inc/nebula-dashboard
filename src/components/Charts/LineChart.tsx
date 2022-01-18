import React from 'react';
import { Chart } from '@antv/g2';
import { ChartCfg } from '@antv/g2/lib/interface';

export interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options?: Partial<ChartCfg>;
  tickInterval?: number;
  baseLine?: number;
  yAxisMaximum?: number;
  isDefaultScale?: boolean;
}

class LineChart extends React.Component<IProps> {
  chartRef: any;

  chartInstance: Chart;

  constructor(props: IProps) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  showScaleByBaseLine = () => {
    const { isDefaultScale, yAxisMaximum, baseLine } = this.props;
    if (isDefaultScale) {
      this.chartInstance.scale({
        value: {
          min: 0,
          max: 100,
          tickInterval: 25,
        },
      });
    } else if (yAxisMaximum === 0 && baseLine) {
      this.chartInstance.scale('value', {
        ticks: [0, baseLine, Math.round(baseLine * 1.5)],
      });
    } else {
      this.chartInstance.scale('value', { ticks: [] }); // If yAxisMaximum is not 0, you do not need to set scale
    }
  };

  updateChart = () => {
    const { options, baseLine } = this.props;
    if (baseLine !== undefined) {
      // HACK: baseLine could be 0
      this.chartInstance.annotation().clear(true);
      this.chartInstance.annotation().line({
        start: ['min', baseLine],
        end: ['max', baseLine],
        style: {
          stroke: '#e6522b',
          lineWidth: 1,
          lineDash: [3, 3],
          zIndex: 999,
        },
      });
      this.showScaleByBaseLine();
    }
    // HACK: updateOptions not work, https://github.com/antvis/G2/issues/2844
    if (options) {
      this.chartInstance.padding = options.padding as any;
    }
    // HACK: G2 Chart autoFit don't take effect , refer: https://github.com/antvis/g2/commit/92d607ec5408d1ec949ebd95209c84b04c73b944, but not work
    if (this.chartInstance.height < 100) {
      const e = document.createEvent('Event');
      e.initEvent('resize', true, true);
      window.dispatchEvent(e);
    }
    this.chartInstance.render(true);
  };

  renderChart = () => {
    const { options, baseLine } = this.props;
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      autoFit: true,
      padding: [20, 0, 0, 0],
      ...options,
    });
    if (baseLine) {
      this.chartInstance.annotation().line({
        start: ['min', baseLine],
        end: ['max', baseLine],
        style: {
          stroke: '#e6522b',
          lineWidth: 1,
          lineDash: [3, 3],
        },
      });
    }
    this.showScaleByBaseLine();
    this.chartInstance.interaction('brush');
    this.props.renderChart(this.chartInstance);
    this.chartInstance.render();
  };

  render() {
    return (
      <div className="nebula-chart nebula-chart-line" ref={this.chartRef} />
    );
  }
}

export default LineChart;
