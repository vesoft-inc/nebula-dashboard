import React from 'react';
import LineCard from '@/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@/utils/promQL';
import { ILineChartMetric } from '@/utils/interface';

interface IProps {
  data: ILineChartMetric[];
  loading: boolean;
  baseLine?: number;
}

class Card extends React.Component<IProps> {
  render() {
    const { data, baseLine, loading } = this.props;
    return (
      <LineCard
        baseLine={baseLine}
        data={data}
        valueType={VALUE_TYPE.number}
        loading={loading}
      />
    );
  }
}

export default Card;
