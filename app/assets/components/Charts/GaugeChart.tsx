import React from 'react';
import { Progress } from 'antd';

interface IProps {
  percent: number;
}

class GaugeChart extends React.Component<IProps> {
  getGaugeColor = (percent) => {
    if (percent <= 30) {
      return '#3DD188';
    } else if (percent <= 70) {
      return '#F5B60D';
    } else {
      return '#E25F5F';
    }
  }

  render () {
    const { percent } = this.props;
    const color = this.getGaugeColor(percent);
    return <Progress className="nebula-chart nebula-chart-gauge" strokeLinecap="square" strokeColor={color} type="dashboard" percent={percent} width={140} strokeWidth={20} />;
  }
}

export default GaugeChart;