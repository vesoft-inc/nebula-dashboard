import React from 'react';
import { Chart } from '@antv/g2';

interface IProps {
}

class AreaChart extends React.Component<IProps> {
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
    // TODO: mock data temporary
    const data = [
      {
        time: 1611648996691,
        value: 20,
        type: 'instance1',
      },
      {
        time: 1611648924707,
        value: 25,
        type: 'instance1',
      }
    ]
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      autoFit: true,
      height: 120,
      padding: [20, 20, 0, 20],
    })
    this.chartInstance
      .data(data)
      .scale({
        value: {
          nice: true,
        },
      })
      .axis(false)
      .legend(false)
      .area()
      .adjust('stack')
      .position('time*value')
      .color('type')
      .size(1);
    this.chartInstance.render();
  }

  render() {
    return (
      <div className="nebula-chart nebula-chart-area" ref={this.chartRef}>
      </div>
    )
  }
}

export default AreaChart;