import _ from 'lodash';
import React from 'react';
import { Table,Tooltip } from 'antd';
import Icon from '@assets/components/Icon';

import './index.less';

interface IState {
  data: any[];
}
interface IProps {
}

class Snapshot extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [
        {
          id:'id1',
          name:'name',
          status: 'VALID',
          hosts: '172.28.2.1:44500，172.28.2.2:44500，172.28.2.3:44500',
        },
        {
          id:'id2',
          name:'name',
          status: 'INVALID',
          hosts: '172.28.2.1:44500，172.28.2.2:44500，172.28.2.3:44500',
        },
        {
          id:'id3',
          name:'name',
          status: 'INVALID',
          hosts: '172.28.2.1:44500，172.28.2.2:44500，172.28.2.3:44500',
        },
      ]
    }
  }

  renderTooltip=text=>{
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>
  }

  render() {
    const {data } = this.state;
    const columns =[
      {
        title: 'Name',
        dataIndex: 'name',
        width:'30%',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width:'30%',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Hosts',
        dataIndex: 'hosts',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
    ]
    return (
      <div className="service-info" >
        <Table 
          rowKey={(record: any) => record.id} 
          dataSource={data} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default  Snapshot;
