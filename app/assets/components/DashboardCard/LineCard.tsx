import LineChart from '@assets/components/Charts/LineChart';
import React from 'react';
import { Chart, Geometry } from '@antv/g2';
import { ILineChartMetric, IStatSingleItem } from '@assets/utils/interface';
import { configDetailChart } from '@assets/utils/chart/chart';
import { VALUE_TYPE } from '@assets/utils/promQL';
interface IProps {
  data: ILineChartMetric[];
  valueType: VALUE_TYPE;
  sizes?: IStatSingleItem[]
  loading: boolean;
}

class LineCard extends React.Component<IProps> {
  chartInstance: Chart;
  areaGeometry: Geometry;
  lineGeometry: Geometry;
  componentDidUpdate () {
    this.updateChart();
  }

  renderLineChart = (chartInstance: Chart) => {
    const { valueType, sizes } = this.props;
    this.chartInstance = chartInstance;

    configDetailChart(this.chartInstance, {
      valueType,
      sizes, 
      isCard: true,
    });

    this.updateChart();   
  }

  updateChart = () => {
    const { data = [] } = this.props;
    this.chartInstance.changeData(data);
  }

  render () {
    /*
     * TODO: it now will conflict with the same request loading in detail component
     * issue: https://github.com/vesoft-inc-private/nebula-dashboard/issues/34
    **/
    // const { loading } = this.props;
    // if (loading) {
    //   return <Spin />;
    // }

    return (
      <LineChart renderChart={this.renderLineChart} options={{ padding: [20, 27, 60, 80 ] }} />
    );
  }
}

export default LineCard;
