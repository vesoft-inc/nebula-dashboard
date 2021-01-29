import React from 'react'

import DataStatistic from '@assets/components/DataStatistic'


class CellularDataStatistics extends React.Component {

  render() {
    const data = '123'
    return (<>
      <DataStatistic title="上行平均流量统计" data={data} />
      <DataStatistic title="下行平均流量统计" data={data} />
    </>)
  }
}
export default CellularDataStatistics