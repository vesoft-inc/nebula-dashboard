import AreaChart from '@assets/components/Charts/AreaChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class MemoryAverage extends React.Component {
  render() {
    return (
      <div className="memory-average average-card">
        <GaugeChart percent={85}></GaugeChart>
        <AreaChart></AreaChart>
      </div>
    )
  }
}

export default MemoryAverage;