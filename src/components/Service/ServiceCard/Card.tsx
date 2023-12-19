import { Component } from 'react';
import LineCard from '@/components/DashboardCard/LineCard';
import { VALUE_TYPE } from '@/utils/promQL';
import { ILineChartMetric, ServiceName } from '@/utils/interface';

interface IProps {
  data: ILineChartMetric[];
  loading: boolean;
  baseLine?: number;
  serviceType: ServiceName;
}

class Card extends Component<IProps> {
  render() {
    const { data, baseLine, loading, serviceType } = this.props;
    return (
      <LineCard
        baseLine={baseLine}
        data={data}
        valueType={VALUE_TYPE.number}
        serviceType={serviceType}
        loading={loading}
      />
    );
  }
}

export default Card;
