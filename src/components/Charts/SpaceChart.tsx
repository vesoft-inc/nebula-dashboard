import { getProperByteDesc, getWhichColor } from '@/utils/dashboard';
import React from 'react';
import intl from 'react-intl-universal';
import './SpaceChart.less';

interface IData {
  type: string;
  value: number;
  size: number;
}
interface IProps {
  data?: IData[];
}

interface ISpaceBarProps {
  name: string;
  used: number;
  size: number;
}

const SpaceBar = (props: ISpaceBarProps) => {
  const { name, used, size: bytes } = props;
  const percent = Math.round((used / bytes) * 100);
  const color = getWhichColor(percent);
  const { desc: sizeDesc } = getProperByteDesc(bytes);
  const { desc: usedDesc } = getProperByteDesc(used);
  const _percent = percent < 1 ? Number(percent.toFixed(2)) : percent;
  return (
    <div className="space-bar">
      <p className="description">
        <span>{name}</span>
        <span>
          {usedDesc}/{sizeDesc}
        </span>
      </p>
      <div className="wrap">
        <div className="bar-item" style={{ width: `${percent}%` }}>
          <div className="left" style={{ backgroundColor: color }} />
          <div className="right" style={{ backgroundColor: color }} />
        </div>
        <div className="empty" />
        <p>{_percent}%</p>
      </div>
    </div>
  );
};

class SpaceChart extends React.Component<IProps> {
  render() {
    let { data } = this.props;
    const showTip = !!data?.length && data?.length > 2;
    if (showTip) {
      data = data?.slice(0, 3);
    }
    return (
      <div className="nebula-chart nebula-chart-space">
        {data?.map(instance => (
          <SpaceBar
            key={instance.type}
            used={instance.value}
            name={instance.type}
            size={instance.size}
          />
        ))}
        {showTip && <p className="tip">{intl.get('device.diskTip')}</p>}
      </div>
    );
  }
}

export default SpaceChart;
