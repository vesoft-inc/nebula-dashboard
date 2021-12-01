import LineChart from '@/components/Charts/LineChart';
import React from 'react';
import _ from 'lodash';
import { Chart, Geometry } from '@antv/g2';
import { ILineChartMetric, IStatSingleItem } from '@/utils/interface';
import { configDetailChart } from '@/utils/chart/chart';
import { VALUE_TYPE } from '@/utils/promQL';
import { getMaxNumAndLength } from '@/utils/dashboard';
import { Spin } from 'antd';

interface IProps {
  data: ILineChartMetric[];
  valueType: VALUE_TYPE;
  sizes?: IStatSingleItem[];
  loading: boolean;
  baseLine?: number;
}

class LineCard extends React.Component<IProps> {
  chartInstance: Chart;

  areaGeometry: Geometry;

  lineGeometry: Geometry;

  componentDidUpdate() {
    /*
     * HACK: it now will conflict with the same request loading in detail component
     * issue: https://github.com/vesoft-inc-private/nebula-dashboard/issues/34
     * */
    const { loading } = this.props;
    if (!loading) {
      this.updateChart();
    }
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
  };

  updateChart = () => {
    const { data = [] } = this.props;
    this.chartInstance.changeData(data);
  };

  render() {
    const { loading, data, valueType, baseLine } = this.props;
    const { maxNum, maxNumLen } = getMaxNumAndLength({
      data,
      valueType,
      baseLine,
    });
    if (loading) {
      return <Spin />;
    }
    return (
      <LineChart
        isDefaultScale={valueType === VALUE_TYPE.percentage} // VALUE_TYPE.percentage has a default Scale
        baseLine={baseLine}
        yAxisMaximum={maxNum}
        renderChart={this.renderLineChart}
        options={{ padding: [20, 20, 60, 6 * maxNumLen + 30] }}
      />
    );
  }
}

export default LineCard;
