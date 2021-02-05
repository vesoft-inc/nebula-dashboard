import LineChart from '@assets/components/Charts/LineChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';

class DiskAverage extends React.Component {
  render () {
    return (
      <div className="disk-average average-card">
        <LineChart />
        <GaugeChart percent={60} />
      </div>
    );
  }
}

export default DiskAverage;