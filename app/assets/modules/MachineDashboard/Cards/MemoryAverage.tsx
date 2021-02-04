import LineChart from '@assets/components/Charts/LineChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class MemoryAverage extends React.Component {
  render() {
    return (
      <div className="memory-average average-card">
        <GaugeChart percent={85}></GaugeChart>
        <LineChart></LineChart>
      </div>
    )
  }
}

export default MemoryAverage;