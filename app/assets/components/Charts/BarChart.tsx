import { Chart } from '@antv/g2';
import React from 'react';

interface IProps {
}

class BarChart extends React.Component {
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
        type: 'instance-01',
        value: 100,
      },
      {
        type: 'instance-02',
        value: 10,
      },
      {
        type: 'instance-03',
        value: 20,
      },
      {
        type: 'instance-04',
        value: 40,
      },
    ];
    
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      height: 200,
      padding: 'auto',
    });
    this.chartInstance.forceFit();
    this.chartInstance
      .data(data)
      .scale({
        value: {
          max: 100,
          min: 0,
        }
      })
      .axis('type', {
        tickLine: null,
        line: null,
      })
      .axis('value', {
        grid: null,
        label: null,
        tickLine: null,
        line: null,
        title: null,
      })
      .legend(false)
      .coordinate('rect')
      .transpose();

    this.chartInstance
      .interval()
      .position('type*value')
      .size(26)
      .label('value', {
        style: {
          fill: '#595959',
        }
      })
    this.chartInstance.interaction('element-active')
    this.chartInstance.render();
  }

  render() {
    return (
      <div className="nebula-chart nebula-chart-bar" ref={this.chartRef}>
      </div>
    )
  }
}

export default BarChart;