import React from 'react';
import LineCard from '@assets/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@assets/utils/promQL';
import { ILineChartMetric } from '@assets/utils/interface';
interface IProps {
  data: ILineChartMetric[];
  loading: boolean;
<<<<<<< HEAD
  baseLine?: number;
=======
  baseLineNum?: number;
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
}

class Card extends React.Component<IProps> {
  render() {
<<<<<<< HEAD
    const { data, baseLine, loading } = this.props;
    return (<LineCard
      baseLine={baseLine}
=======
    const { data, baseLineNum, loading } = this.props;
    return (<LineCard
      baseLineNum={baseLineNum}
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
      data = {data}
      valueType ={VALUE_TYPE.number}
      loading= {loading}
    />
    );};
};

export default Card;