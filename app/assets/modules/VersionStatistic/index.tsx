import React from 'react';
import ServiceItem from './ServiceItem';

interface IProps {
}

interface IState {
  displayMode: string
}

class VersionStatistic extends React.Component<IProps, IState> {

  render () {
    return (<div className="version-statistics">
      <ServiceItem title="Graph Service" icon="#iconservice-graph" mode="blue" />
      <ServiceItem title="Storage Service" icon="#iconservice-storage" mode="pink" />
      <ServiceItem title="Meta Service" icon="#iconservice-meta" mode="skyblue" />
    </div>);
  }
}
export default VersionStatistic;