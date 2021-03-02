import { Col, Row } from 'antd';
import React from 'react';
import Icon from '@assets/components/Icon';
import LineChart from '@assets/components/Charts/LineChart';
import intl from 'react-intl-universal';
import { IServiceItem } from '@assets/utils/interface';
import { Chart } from '@antv/g2';
import dayjs from 'dayjs';
import { getColors } from '@assets/utils/service';
import './index.less';
interface IProps {
  data: IServiceItem;
  mode: string;
}
class ItemCell extends React.PureComponent<IProps> {
  chartInstance: Chart;
  renderLineChart = (chartInstance: Chart) => {
    const { mode } = this.props;
    const COLORS = (getColors(mode)) as any;
    this.chartInstance = chartInstance;

    this.chartInstance
      .line()
      .color(COLORS.LINE)
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
    const { data: { name, qps, latency, error, version, status }, mode } = this.props;
    const info = {
      qps,
      latency,
      error,
      version
    };
    const options = {
      height: 75,
      padding: [20, 20, 0, 20]
    };
    return (
      <div
        className={status === 'OVERLOAD' ? 'service-item overload-item' : status === 'ABNORMAL' ? 'service-item abnormal-item' : 'service-item'}>
        <div className="title">
          <div className="name">
            <Icon icon="#iconservice" className={mode} />
            <span>{name}</span>
          </div>
          <div className="status">
            {status === 'NORMAL' && <>
              <Icon icon="#iconnormal" className="green" />
              <span className="green">{intl.get('service.normal')}</span>
            </>}
            {status === 'OVERLOAD' && <>
              <Icon icon="#iconoverload" className="yellow" />
              <span className="yellow">{intl.get('service.overload')}</span>
            </>}
            {status === 'ABNORMAL' && <>
              <Icon icon="#iconabnormal" className="red" />
              <span className="red">{intl.get('service.abnormal')}</span>
            </>}
          </div>
        </div>
        <div className="chart-item">
          <LineChart options={options} renderChart={this.renderLineChart} />
        </div>
        <Row className="chart-data">
          {Object.keys(info).map(label => (
            <Col span="12" key={label}>
              <span className="label">{label}:</span>
              <span className="value">{info[label]}</span>
            </Col>)
          )}
        </Row>
      </div>
    );
  }
}

export default ItemCell;