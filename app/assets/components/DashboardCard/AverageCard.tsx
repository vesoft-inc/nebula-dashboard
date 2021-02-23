import LineChart from '@assets/components/Charts/LineChart';
import GaugeChart from '@assets/components/Charts/GaugeChart';
import React from 'react';
import { Spin } from 'antd';
import { Chart, Geometry } from '@antv/g2';
import dayjs from 'dayjs';
import { IMetric, getWhichColor } from '@assets/utils/dashboard';

interface IProps {
  averageUsage: IMetric[];
  currentAverageUsage: number;
  loading: boolean;
}

class AverageCard extends React.Component<IProps> {
  chartInstance: Chart;
  areaGeometry: Geometry;
  lineGeometry: Geometry;
  componentDidUpdate () {
    this.updateChart();
  }

  renderLineChart = (chartInstance: Chart) => {
    const { currentAverageUsage  } = this.props;
    const COLORS = getWhichColor(currentAverageUsage);
    this.chartInstance = chartInstance;

    this.lineGeometry = this.chartInstance
      .line()
      .color(COLORS.SOLID)
      .position('time*value');
    this.areaGeometry = this.chartInstance
      .area()
      .style({
        fill: `l(90) 0:${COLORS.SOLID} 1:${COLORS.TRANSPARENT}`,
      })
      .adjust('stack')
      .position('time*value')
      .color(COLORS.SOLID)
      .size(1);
    
    
    this.chartInstance
      .tooltip({
        customItems: items => {
          return [
            {
              ...items[0],
              value: items[0].value + '%'
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      })
      .scale('value', {
        min: 0,
        max: 100,
      });

    this.updateChart();   
  }

  updateChart = () => {
    const { averageUsage } = this.props;
    const { currentAverageUsage  } = this.props;
    const COLORS = getWhichColor(currentAverageUsage);

    this.lineGeometry.color(COLORS.SOLID);
    this.areaGeometry
      .style({
        fill: `l(90) 0:${COLORS.SOLID} 1:${COLORS.TRANSPARENT}`,
      });
    this.chartInstance.data(averageUsage)
      .render();
  }

  render () {
    const { currentAverageUsage, loading } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="average-card">
          <LineChart renderChart={this.renderLineChart} />
          <GaugeChart percent={currentAverageUsage} />
        </div>
      </Spin>
    );
  }
}

export default AverageCard;
