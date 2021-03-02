import { Col, Row } from 'antd';
import React from 'react';
import Icon from '@assets/components/Icon';
import LineChart from '@assets/components/Charts/LineChart';
import intl from 'react-intl-universal';
import './index.less';
import { IQPSStatistics } from '@assets/utils/interface';
import { Chart } from '@antv/g2';
import { getColors } from '@assets/utils/service';
import dayjs from 'dayjs';

interface IProps {
  data: IQPSStatistics,
  mode: string,
}
class OverviewCell extends React.PureComponent<IProps> {
  chartInstance: Chart;
  renderLineChart = (chartInstance: Chart) => {
    const { mode } = this.props;
    const COLORS = (getColors(mode)) as any;
    this.chartInstance = chartInstance;

    this.chartInstance
      .line()
      .color(COLORS.LINE)
      .size(2)
      .position('time*value');
    this.chartInstance
      .area()
      .style({
        fill: `l(90) 0:${COLORS.AREA_TOP} 1:${COLORS.AREA_BOTTOM}`,
      })
      .position('time*value')
      .color('type')
      .size(1);
    
    
    this.chartInstance
      .tooltip({
        customItems: items => {
          return [
            {
              ...items[0],
              value: items[0].value
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      })
      .axis(false)
      .scale('value', {
        nice: true
      });

    this.updateChart();   
  }

  updateChart = () => {
    const { data: { qpsStatistics } } = this.props;
    this.chartInstance.changeData(qpsStatistics);
  }

  componentDidUpdate () {
    this.updateChart();
  }

  render () {
    const { data: { normal, overload, abnormal, qps }, mode } = this.props;
    const totalNum = normal + overload + abnormal;
    return (<div className="service-overview">
      <div className="title">
        <div className="name">
          <Icon icon="#iconservice-status" className={mode} />
          <span>{intl.get('service.serviceStatus')}</span>
        </div>
      </div>
      <div className="flex status-row">
        <div className="status-grid">
          <Row>
            <Col className="bg-green" span={ Math.round(normal / totalNum * 24) } />
            <Col className="bg-yellow" span={ Math.round(overload / totalNum * 24) } />
            <Col className="bg-red" span={ Math.round(abnormal / totalNum * 24) } />
          </Row>
        </div>
        <div className="status-overview">
          <div className="status-item">
            <span className="green status">{intl.get('service.normal')}</span>
            <span>{normal}</span>
          </div>
          <div className="status-item">
            <span className="yellow status">{intl.get('service.overload')}</span>
            <span>{overload}</span>
          </div>
          <div className="status-item">
            <span className="red status">{intl.get('service.abnormal')}</span>
            <span>{abnormal}</span>
          </div>
        </div>
      </div>
      <div className="flex qps-row">
        <div className="chart-qps">
          <LineChart options={{ height: 44, padding: [0, 0, 0, 0] }} renderChart={this.renderLineChart} />
        </div>
        <div className="qps">
          <span className="qps-header">{intl.get('service.qps')}</span>
          <span className="qps-value">{qps}</span>
        </div>
      </div>
    </div>);
  }
}

export default OverviewCell;