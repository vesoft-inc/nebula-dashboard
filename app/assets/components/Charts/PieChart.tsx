import { Chart, Util } from '@antv/g2';
import React from 'react';

interface IProps {
}

class PieChart extends React.Component {
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
      { type: '1.1.4', value: 0.19 },
      { type: '1.1.2', value: 0.21 },
      { type: '2.0.0-nightly', value: 0.27 },
      { type: '2.0.0-rc', value: 0.33 },
    ];
    
    this.chartInstance = new Chart({
      container: this.chartRef.current,
      height: 175,
      width: 500,
      padding: 'auto',
    });

    this.chartInstance.data(data);

    this.chartInstance.coordinate('theta', {
      radius: 0.75,
    });
    this.chartInstance.tooltip({
      showMarkers: false
    });
      
    this.chartInstance.interval()
      .adjust('stack')
      .position('value')
      .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060'])
      .style({ opacity: 0.4 })
      .state({
        active: {
          style: (element) => {
            const shape = element.shape;
            return {
              matrix: Util.zoom(shape, 1.1),
            }
          }
        }
      })
      
    this.chartInstance.interaction('element-single-selected')
    this.chartInstance.render();
  }

  render() {
    return (
      <div className="nebula-chart nebula-chart-pie" style={{ padding: 20 }} ref={this.chartRef}>
      </div>
    )
  }
}

export default PieChart;