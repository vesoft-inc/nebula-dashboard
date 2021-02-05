import BatteryChart from '@assets/components/Charts/BatteryChart';
import React from 'react';

class DiskDetail extends React.Component {
  render () {
    return (
      <div className="disk-detail detail-card">
        <BatteryChart />
      </div>
    );
  }
}

export default DiskDetail;