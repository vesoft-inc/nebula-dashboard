import { Select, Table } from 'antd'
import React from 'react'
import intl from 'react-intl-universal';

import './index.less'
import PieChart from '@assets/components/Charts/PieChart'

const { Option } = Select;

interface IProps {
}

interface IState {
}

class PartitionDistribution extends React.Component<IProps, IState> {

  render() {
    const columns = [{
      title: intl.get('common.service'),
      dataIndex: 'name',
    },{
      title: intl.get('service.leaderNumber'),
      dataIndex: 'leaderNumber',
    },{
      title: intl.get('service.leaderDistribute'),
      dataIndex: 'leaderDistribute',
    }]
    const data = [{
      name: 'storage-db-0',
      leaderNumber: 66,
      leaderDistribute: 'space1:33，space2:33'
    },{
      name: 'storage-db-0',
      leaderNumber: 66,
      leaderDistribute: 'space1:33，space2:33'
    },{
      name: 'storage-db-0',
      leaderNumber: 66,
      leaderDistribute: 'space1:33，space2:33'
    },{
      name: 'storage-db-0',
      leaderNumber: 66,
      leaderDistribute: 'space1:33，space2:33'
    },]
    return (<div className="partition-distribution">
      <div className="common-header">
        <span>Partition Leader 分布</span>
        <div className="select-space">
          <span>Space:</span>
          <Select defaultValue="space1">
            <Option value="space1">space1</Option>
            <Option value="space2">space2</Option>
            <Option value="space3">space3</Option>
          </Select>
        </div>
      </div>
      <div className="leader-content">
        <PieChart />
        <Table
          className="leader-table"
          columns={columns} 
          dataSource={data} 
          pagination={false}
          rowKey="id"
        />
      </div>
    </div>)
  }
}
export default PartitionDistribution