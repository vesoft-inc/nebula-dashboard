import _ from 'lodash';
import React from 'react';
import {Input,Select,Table,Tooltip } from 'antd';
import intl from 'react-intl-universal';
import Icon from '@assets/components/Icon';

import './index.less';

interface IState {
  data: any[];
  spaces: string[];
}
interface IProps {
}

class PartitionInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [
        {
          id:'id1',
          partitionId:'partitionId',
          leader: 'leader',
          peers: 'peers',
          losts: 'losts',
          module: 'Storage'
        },
        {
          id:'id2',
          partitionId:'partitionId',
          leader: 'leader',
          peers: 'peers',
          losts: 'losts',
          module: 'Graph',
        },
        {
          id:'id3',
          partitionId:'partitionId',
          leader: 'leader',
          peers: '',
          losts: 'losts',
          module: 'Meta',
        },
      ],
      spaces:[
        'space1','space2'
      ]
    }
  }

  renderTooltip=text=>{
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>
  }

  render() {
    const {data,spaces} = this.state;
    const columns =[
      {
        title: 'Partition ID',
        dataIndex: 'partitionId',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader',
        dataIndex: 'leader',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Peers',
        dataIndex: 'peers',
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Losts',
        dataIndex: 'losts',
        render:losts =><span>{losts||'-'}</span>,
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'module',
        dataIndex: 'module',
        render:module => <span className={`module ${module.toLowerCase()}`}>{module}</span>,
        filterDropdown: (<div></div>), 
        filterIcon: this.renderTooltip('文案未定'),
      }
    ]
    return (
      <div className="service-info" >
        <div className="common-header">
          <div className="service-screen">
            <span>{intl.get('service.spaces')}:</span>
            <Select className="service-select" style={{ width: 120 }}>
              {spaces.map(space=>{
                return <Select.Option value={space} key={space}>{space}</Select.Option>
              })}
            </Select>
          </div>
          <div className="service-screen">
            <span>{intl.get('service.services')}:</span>
            <Select className="service-select" style={{ width: 120 }}>
              {spaces.map(space=>{
                return <Select.Option value={space} key={space}>{space}</Select.Option>
              })}
            </Select>
          </div>
          <div className="service-screen">
            <span>{intl.get('service.partition')}:</span>
            <Input.Search />
          </div>
        </div>
        <Table 
          rowKey={(record: any) => record.id} 
          dataSource={data} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default  PartitionInfo;
