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

class LongTermTask extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [
        {
          id:'id1',
          jobId:'jobId',
          command:'command',
          status: 'FINISHED',
          startTime: '12/02/20 09:41:5', 
          stopTime: '12/02/20 09:41:5',
        },
        {
          id:'id2',
          jobId:'jobId',
          command:'command',
          status: 'RUNNING',
          startTime: '12/02/20 09:41:5', 
          stopTime: '12/02/20 09:41:5',
        },
        {
          id:'id3',
          jobId:'jobId',
          command:'command',
          status: 'QUEUE',
          startTime: '12/02/20 09:41:5', 
          stopTime: '12/02/20 09:41:5',
        },
        {
          id:'id4',
          jobId:'jobId',
          command:'command',
          status: 'FAILED',
          startTime: '12/02/20 09:41:5', 
          stopTime: '12/02/20 09:41:5',
        },
        {
          id:'id5',
          jobId:'jobId',
          command:'command',
          status: 'STOPPED',
          startTime: '12/02/20 09:41:5', 
          stopTime: '12/02/20 09:41:5',
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
        title: 'Job ID',
        dataIndex: 'jobId',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Command',
        dataIndex: 'command',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Stop Time',
        dataIndex: 'stopTime',
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

export default  LongTermTask;
