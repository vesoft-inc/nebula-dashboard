import { Chart } from '@antv/g2';
import LineChart from '@assets/components/Charts/LineChart';
import { ILineChartMetric } from '@assets/utils/interface';
import { getAdaptiveFlowValue } from '@assets/utils/dashboard';
import React from 'react';
import intl from 'react-intl-universal';
import dayjs from 'dayjs';
import './FlowLineChart.less';

interface IProps {
  flowData: ILineChartMetric[]
  latestReceiveFlow: ILineChartMetric
  latestTransmitFlow: ILineChartMetric
}

class FlowLineChart extends React.Component<IProps> {
  chartInstance: Chart;
  renderLineChart = (chartInstance: Chart) => {
    this.chartInstance = chartInstance;
    this.chartInstance
      .tooltip({
        customItems: items => {
          const { value, unit } = getAdaptiveFlowValue(items[0].value);
          return [
            {
              ...items[0],
              value: value + ' ' + unit,
            }
          ];
        },
        title: time =>  {
          return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      })
      .axis(false)
      .legend(false)
      .line()
      .color('type', ['#4372FF', '#3DD188'])
      .position('time*value')
      .shape('smooth');
  }

  componentDidUpdate () {
    this.updateChart();
  }

  updateChart = () => {
    const { flowData } = this.props;
    this.chartInstance
      .changeData(flowData);
  }

  render () {
    const defaultValue = { value : 0 };
    const { latestReceiveFlow = defaultValue, latestTransmitFlow = defaultValue } = this.props;
    const _latestReceiveFlow =  getAdaptiveFlowValue(latestReceiveFlow.value);
    const _latestTransmitFlow = getAdaptiveFlowValue(latestTransmitFlow.value);
    return <div className="flow-line-chart-wrap">
      <LineChart options={{ height: 48 }} renderChart={this.renderLineChart} />
      <div className="flow-label">
        <p>
          <span>{intl.get('device.detail.up')}</span>
          <span>{_latestTransmitFlow.value}{_latestTransmitFlow.unit} / s</span>
        </p>
        <p>
          <span>{intl.get('device.detail.down')}</span>
          <span>{_latestReceiveFlow.value}{_latestReceiveFlow.unit} / s</span>
        </p>
      </div>
    </div>;
  }
}

export default FlowLineChart;