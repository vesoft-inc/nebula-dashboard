import { Chart } from '@antv/g2';
import { ChartCfg } from '@antv/g2/lib/interface';

import React from 'react';

interface IProps {
  renderChart: (chartInstance: Chart) => void;
  options?: Partial<ChartCfg>;
}

class PieChart extends React.Component<IProps> {
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
    const { options } = this.props;
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      height: 175,
      width: 500,
      padding: 'auto',
      ...options,
    });
    this.props.renderChart(this.chartInstance);
    this.chartInstance.render();
  };

  render() {
    return (
      <div
        className="nebula-chart nebula-chart-pie"
        style={{ textAlign: 'center' }}
        ref={this.chartRef}
      />
    );
  }
}

export default PieChart;
