import React from 'react';
import ServiceTable from './ServiceTable';
class ServiceOverview extends React.Component {

  render () {
    const overviewInfos = {
      normal: 10,
      overload: 2,
      abnormal: 1,
      averageQps: 122
    };
    const serviceList = [
      {
        name: 'Graph_0023',
        status: 'normal',
        info: {
          qps: 111,
          latency: '20ms',
          error: 0,
          version: '1.1.2'
        }
      },{
        name: 'Graph_0023',
        status: 'overload',
        info: {
          qps: 111,
          latency: '20ms',
          error: 0,
          version: '1.1.2'
        }
      },{
        name: 'Graph_0023',
        status: 'abnormal',
        info: {
          qps: 111,
          latency: '20ms',
          error: 0,
          version: '1.1.2'
        }
      },{
        name: 'Graph_0023',
        status: 'normal',
        info: {
          qps: 111,
          latency: '20ms',
          error: 0,
          version: '1.1.2'
        }
      },{
        name: 'Graph_0023',
        status: 'normal',
        info: {
          qps: 111,
          latency: '20ms',
          error: 0,
          version: '1.1.2'
        }
      },
    ];
    return (<div>
      <ServiceTable title="Graph Service" icon="#iconservice-graph" mode="blue" data={{ overviewInfos, serviceList }} />
      <ServiceTable title="Storage Service" icon="#iconservice-storage" mode="pink" data={{ overviewInfos, serviceList }} />
      <ServiceTable title="Meta Service" icon="#iconservice-meta" mode="skyblue" data={{ overviewInfos, serviceList }} />
    </div>);
  }
}
export default ServiceOverview;