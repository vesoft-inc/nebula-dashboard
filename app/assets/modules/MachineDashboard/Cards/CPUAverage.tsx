import AreaChart from '@assets/components/Charts/AreaChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class CPUAverage extends React.Component {
  render() {
    return (
      <div className="cpu-average average-card">
        <GaugeChart percent={30}></GaugeChart>
        <AreaChart></AreaChart>
      </div>
    )
  }
}

export default CPUAverage;