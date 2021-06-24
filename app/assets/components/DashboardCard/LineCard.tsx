import LineChart from '@assets/components/Charts/LineChart';
import React from 'react';
import _ from 'lodash';
import { Chart, Geometry } from '@antv/g2';
import { ILineChartMetric, IStatSingleItem } from '@assets/utils/interface';
import { configDetailChart } from '@assets/utils/chart/chart';
import { VALUE_TYPE } from '@assets/utils/promQL';
<<<<<<< HEAD
import { getMaxNumAndLength } from '@assets/utils/dashboard';
=======
import { getProperByteDesc } from '@assets/utils/dashboard';
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
import { Spin } from 'antd';
interface IProps {
  data: ILineChartMetric[];
  valueType: VALUE_TYPE;
  sizes?: IStatSingleItem[]
  loading: boolean;
<<<<<<< HEAD
  baseLine?: number;
=======
  baseLineNum?: number;
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
}

class LineCard extends React.Component<IProps> {
  chartInstance: Chart;
  areaGeometry: Geometry;
  lineGeometry: Geometry;
  componentDidUpdate() {
    /*
     * HACK: it now will conflict with the same request loading in detail component
     * issue: https://github.com/vesoft-inc-private/nebula-dashboard/issues/34
    **/
    const { loading } = this.props;
    if(!loading){
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
  }

  updateChart = () => {
    const { data = [] } = this.props;
    this.chartInstance.changeData(data);
  }

<<<<<<< HEAD
  render() {
    const { loading, data, valueType, baseLine } = this.props;
    const { maxNum, maxNumLen } = getMaxNumAndLength({
      data,
      valueType,
      baseLine
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
        options={{ padding: [20, 20, 60, 6 * maxNumLen + 30 ] }} 
      />
=======
  getMaxLength = () => {
    const { data = [], valueType } = this.props;
    const max = _.maxBy(data, item => item.value);
    const maxNum = max ? max.value : 0;
    const maxNumLen = maxNum.toString().length;

    switch (valueType) {
      case VALUE_TYPE.percentage:
        return 5;
      case VALUE_TYPE.byte:
      case VALUE_TYPE.byteSecond:
        const { value, unit } = getProperByteDesc(maxNum);
        if (valueType === VALUE_TYPE.byteSecond) {
          return unit.length + value.toString().length+2;
        }
        return unit.length + value.toString().length;
      case VALUE_TYPE.numberSecond:
        return maxNumLen + 2;
      default:
        return maxNumLen;
    }
  }

  render() {
    const { loading, baseLineNum } = this.props;
    if (loading) {
      return <Spin />;
    }

    return (
      <LineChart baseLineNum={baseLineNum} renderChart={this.renderLineChart} options={{ padding: [20, 20, 60, 5 * this.getMaxLength() + 30 ] }} />
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    );
  }
}

export default LineCard;
