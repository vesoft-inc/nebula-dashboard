import React from 'react'

import DataStatistic from '@assets/components/DataStatistic'


class CPUStatistics extends React.Component {

  render() {
    const data = '123'
    return <DataStatistic title="CPU 平均负载检测" data={data} />
  }
}
export default CPUStatistics