import AreaChart from '@assets/components/Charts/AreaChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class DiskAverage extends React.Component {
  render() {
    return (
      <div className="disk-average average-card">
        <AreaChart></AreaChart>
        <GaugeChart percent={60}></GaugeChart>
      </div>
    )
  }
}

export default DiskAverage;