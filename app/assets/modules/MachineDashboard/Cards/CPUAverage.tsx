import LineChart from '@assets/components/Charts/LineChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class CPUAverage extends React.Component {
  render() {
    return (
      <div className="cpu-average average-card">
        <GaugeChart percent={30}></GaugeChart>
        <LineChart></LineChart>
      </div>
    )
  }
}

export default CPUAverage;