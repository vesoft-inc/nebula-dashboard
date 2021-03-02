import React from 'react';
import { Progress } from 'antd';
import './GaugeChart.less';
import { getWhichColor } from '@assets/utils/dashboard';

interface IProps {
  percent: number;
}

class GaugeChart extends React.Component<IProps> {
  render () {
    const { percent } = this.props;
    const color = getWhichColor(percent).SOLID;
    const _percent = percent < 1 ? Number(percent.toFixed(2)) : Math.round(percent);
    return <Progress className="nebula-chart nebula-chart-gauge" strokeLinecap="square" strokeColor={color} type="dashboard" percent={_percent} width={140} strokeWidth={20} />;
  }
}

export default GaugeChart;