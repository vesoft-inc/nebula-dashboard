import React from 'react';
import { Chart } from '@antv/g2';
import { ChartCfg } from '@antv/g2/lib/interface';

export interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options?: Partial<ChartCfg>
  baseLineNum?: number
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

  renderChart = () => {
    const { options, baseLineNum } = this.props;
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      autoFit: true,
      padding: [20, 0, 0, 0],
      ...options,
    });
    if(baseLineNum){
      this.chartInstance.annotation().line({
        start: ['min', baseLineNum],
        end: ['max', baseLineNum],
        style: {
          stroke: '#e6522b',
          lineWidth: 1,
          lineDash: [3, 3],
        },
      });
    }
    this.chartInstance.interaction('brush');
    this.props.renderChart(this.chartInstance);
    this.chartInstance.render();
  }

  render() {
    return (
      <div className="nebula-chart nebula-chart-line" ref={this.chartRef} />
    );
  }
}

export default LineChart;