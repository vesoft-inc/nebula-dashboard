import React from 'react';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import { SERVICE_QUERY_INTERVAL, SERVICE_QUERY_STEP } from '@assets/utils/service';
import ServiceTable from './ServiceTable';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetGraphMetrics: dispatch.service.asyncGetGraphMetrics,
  };
};

const mapState = (state: IRootState) => {
  return {
    graphMetric: state.service.graphMetric,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {

}

interface IState {
}

class ServiceOverview extends React.Component<IProps, IState> {
  pollingTimer: any;
  constructor (props: IProps) {
    super(props);
    this.state = {
    };
  }
  componentDidMount () {
    this.pollingData();
  }

  componentWillUnmount () {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  pollingData = () => {
    this.asyncGetGraphMetrics();
    this.pollingTimer = setTimeout(this.pollingData, 60000);
  }

  asyncGetGraphMetrics = async () => {
    const end = Math.round(Date.now() / 1000);
    await this.props.asyncGetGraphMetrics({
      end,
      interval: SERVICE_QUERY_INTERVAL,
      step: SERVICE_QUERY_STEP
    });
  }
  render () {
    const { graphMetric } = this.props;
    return (<div>
      <ServiceTable title="Graph Service" icon="#iconservice-graph" mode="blue" data={graphMetric} />
      <ServiceTable title="Storage Service" icon="#iconservice-storage" mode="pink" data={graphMetric} />
      <ServiceTable title="Meta Service" icon="#iconservice-meta" mode="skyblue" data={graphMetric} />
    </div>);
  }
}
export default connect(mapState, mapDispatch)(ServiceOverview);
