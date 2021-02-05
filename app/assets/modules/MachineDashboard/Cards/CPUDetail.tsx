import BarChart from '@assets/components/Charts/BarChart';
import React from 'react';

class CPUDetail extends React.Component {
  render () {
    return (
      <div className="cpu-detail detail-card">
        <BarChart />
      </div>
    );
  }
}

export default CPUDetail;