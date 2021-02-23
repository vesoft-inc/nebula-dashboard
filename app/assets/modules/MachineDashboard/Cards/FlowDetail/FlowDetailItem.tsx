import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';
import React from 'react';

class FlowDetailItem extends React.Component {
  renderChart = (chartInstance: Chart) => {
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
    ];
    chartInstance
      .axis(false)
      .data(data)
      .render();
  }

  render () {
    return (<LineChart options={{ height: 36 }} renderChart={this.renderChart} />);
  }
}

export default FlowDetailItem;