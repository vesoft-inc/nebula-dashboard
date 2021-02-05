import LineChart from '@assets/components/Charts/LineChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class FlowAverage extends React.Component {
  render () {
    return (
      <div className="flow-average average-card">
        <LineChart />
        <GaugeChart percent={60} />
      </div>
    );
  }
}

export default FlowAverage;