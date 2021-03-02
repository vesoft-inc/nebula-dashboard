import { getMemoryProperSize, getWhichColor } from '@assets/utils/dashboard';
import React from 'react';
import './SpaceChart.less';

interface IData {
  type: string,
  value: number,
  size?: number,
}
interface IProps {
  data?: IData[]
}

interface ISpaceBarProps {
  name: string;
  percent: number;
  size?: number;
}


const SpaceBar = (props: ISpaceBarProps) => {
  const { name, percent, size: bytes } = props;
  const COLORS = getWhichColor(percent);
  const size = bytes && getMemoryProperSize(bytes);
  const _percent = percent < 1 ? Number(percent.toFixed(2)) : percent;
  return <div className="space-bar">
    <p className="description">
      <span>{name}</span>
      { size && <span>{size}</span>}
    </p>
    <div className="wrap">
      <div className="bar-item" style={{ width: `${percent}%` }} >
        <div className="left" style={{ backgroundColor: COLORS.SOLID }} />
        <div className="right" style={{ backgroundColor: COLORS.SOLID }} />
      </div>
      <p>{_percent}%</p>
    </div>
  </div>;
};

class SpaceChart extends React.Component<IProps> {
  render () {
    const { data } = this.props;
    return <div className="nebula-chart nebula-chart-space">
      {
        data?.map(instance => <SpaceBar key={instance.type} percent={instance.value < 1 ? Number(instance.value.toFixed(2)) : Math.round(instance.value)} name={instance.type} size={instance.size} />)
      }
    </div>;
  }
}

export default SpaceChart;