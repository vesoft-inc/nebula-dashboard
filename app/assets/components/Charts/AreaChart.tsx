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
        time: '2021/1/20',
        value: 20,
        type: 'instance1',
      },
      {
        time: '2021/1/22',
        value: 25,
        type: 'instance1',
      },
      {
        time: '2021/1/25',
        value: 15,
        type: 'instance1',
      },
      {
        time: '2021/1/28',
        value: 30,
        type: 'instance1',
      },
    ]
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      autoFit: true,
      height: 48,
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
    this.chartInstance.area()
      .style({
        fill: 'l(90) 0:rgba(67,114,255,1) 1:rgba(67,114,255,0)',
      })
      .adjust('stack')
      .position('time*value')
      .color('type')
      .size(1);
    this.chartInstance.line().position('time*value');
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