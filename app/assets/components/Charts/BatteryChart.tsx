import React from 'react';
import _ from 'lodash';
import './BatteryChart.less';
import { getDiskProperSize } from '@assets/utils/dashboard';

interface IBatteryProps {
  type: string;
  size: number;
  value: number;
}

const getBatteryColor = (percent) => {
  if (percent <= 50) {
    return '#3DD188';
  } else if (percent <= 80) {
    return '#F5B60D';
  } else {
    return '#E25F5F';
  }
};

const Battery = (props:IBatteryProps) => {
  const { type, value, size: bytes } = props;
  const used = getDiskProperSize(bytes / 100 * value);
  const size = getDiskProperSize(bytes);
  const n = Math.floor(value / 10);
  const m = value - n * 10;
  const color = getBatteryColor(value);
  const _value = value < 1 ? Number(value.toFixed(2)) : Math.round(value);

  return <div className="nebula-battery">
    <div className="wrap">
      <p className="description">
        <span>{type}</span>
        <span>{used} /{size}</span>
      </p>
      <div className="battery">
        {
          _.times(n).map(i => <div key={i} className="battery-cell" style={{ backgroundColor: color }} />)
        }
        { !!m && <div className="battery-cell"><div style={{ width: `${m / 10 * 100}%`, height: '100%', backgroundColor: color }} /></div>}
        {
          _.times(10 - n -1).map(i => <div key={i} className="battery-cell" />)
        }
      </div>
    </div>
    <p>
      {_value}%
    </p>
  </div>;
};


interface IChartDataItem {
  size: number,
  type: string,
  value: number,
}

interface IBatterChartProps {
  data: IChartDataItem[]
}
class BatteryChart extends React.Component<IBatterChartProps> {
  render () {
    const { data } = this.props;
    return <div className="nebula-chart">
      {
        data.map(d => <Battery key={d.type} type={d.type} size={d.size} value={d.value} />)
      }
    </div>;
  }
}

export default BatteryChart;