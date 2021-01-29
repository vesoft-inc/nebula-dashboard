import React from 'react';
import _ from 'lodash';
import './BatteryChart.less';

interface IBatteryProps {
  name: string;
  capacity: number;
  value: number;
  unit: string;
}

const getBatteryColor = (percent) => {
  if (percent <= 50) {
    return '#3DD188';
  } else if (percent <= 80) {
    return '#F5B60D';
  } else {
    return '#E25F5F';
  }
}

const Battery = (props:IBatteryProps) => {
  const { name, value, capacity, unit } = props;
  const percent = Math.round(value / capacity * 100);
  const n = Math.floor(percent / 10);
  const m = percent - n * 10;
  const color = getBatteryColor(percent);

  return <div className="nebula-battery">
    <div className="wrap">
      <p className="description">
        <span>{name}</span>
        <span>{value} /{capacity} {unit}</span>
      </p>
      <div className="battery">
        {
          _.times(n).map(i => <div key={i} className="battery-cell" style={{ backgroundColor: color }}></div>)
        }
        { !!m && <div className="battery-cell"><div style={{ width: `${m / 10 * 100}%`, height: '100%', backgroundColor: color }}></div></div>}
        {
          _.times(10 - n -1).map(i => <div key={i} className="battery-cell"></div>)
        }
      </div>
    </div>
    <p>
      {percent}%
    </p>
  </div>
}

class BatteryChart extends React.Component {
  render() {
    const data = [
      {
        name: 'instance-01',
        value: 150,
        capacity: 200,
        unit: 'GB',
      },
      {
        name: 'instance-01',
        value: 150,
        capacity: 400,
        unit: 'GB',
      },
      {
        name: 'instance-01',
        value: 300,
        capacity: 300,
        unit: 'GB',
      },
    ]
    return <div className="nebula-chart">
      {
        data.map(d => <Battery key={d.name} name={d.name} capacity={d.capacity} value={d.value} unit={d.unit}></Battery>)
      }
    </div>
  }
}

export default BatteryChart;