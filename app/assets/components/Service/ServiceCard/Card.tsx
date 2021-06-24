import React from 'react';
import LineCard from '@assets/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@assets/utils/promQL';
import { ILineChartMetric } from '@assets/utils/interface';
interface IProps {
  data: ILineChartMetric[];
  loading: boolean;
  baseLineNum?: number;
}

class Card extends React.Component<IProps> {
  render() {
    const { data, baseLineNum, loading } = this.props;
    return (<LineCard
      baseLineNum={baseLineNum}
      data = {data}
      valueType ={VALUE_TYPE.number}
      loading= {loading}
    />
    );};
};

export default Card;