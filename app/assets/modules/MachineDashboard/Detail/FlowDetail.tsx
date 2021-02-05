import React from 'react';
import DashboardDetail from '@assets/components/DashboardDetail';
import intl from 'react-intl-universal';
import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';

class FlowDetail extends React.Component {
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
    chartInstance.data(data).render();
  }
  
  render () {
    return <DashboardDetail className="flow-detail" title={intl.get('device.detail.flow')}>
      <LineChart options={{height: 500}} renderChart={this.renderChart} />
    </DashboardDetail>;
  }
}

export default FlowDetail;