import BarChart from '@assets/components/Charts/BarChart';
import React from 'react';

class MemoryDetail extends React.Component {
  render () {
    return (
      <div className="cpu-detail detail-card">
        <BarChart />
      </div>
    );
  }
}

export default MemoryDetail;