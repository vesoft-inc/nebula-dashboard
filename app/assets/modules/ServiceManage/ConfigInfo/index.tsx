import _ from 'lodash';
import React from 'react';
import {Radio,Table,Tooltip } from 'antd';
import intl from 'react-intl-universal';
import Icon from '@assets/components/Icon';

import './index.less';

interface IState {
  data: any[];
}
interface IProps {
}

class ConfigInfo extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.state = {
      data: [
        {
          id:'id1',
          name:'name',
          type: 'type',
          mode: 'mode',
          value: 1,
          module: 'Storage'
        },
        {
          id:'id2',
          name:'name',
          type: 'type',
          mode: 'mode',
          value: 3,
          module: 'Graph',
        },
        {
          id:'id3',
          name:'name',
          type: 'type',
          mode: 'mode',
          value: 6,
          module: 'Meta',
        },
      ]
    };
  }

  renderTooltip=text => {
    return <Tooltip placement="top" title={text} >
      <Icon icon="#iconhelp"/>
    </Tooltip>;
  }

  render () {
    const {data } = this.state;
    const columns =[
      {
        title: 'module',
        dataIndex: 'module',
        render: module => <span className={`module ${module.toLowerCase()}`}>{module}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'name',
        dataIndex: 'name',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'type',
        dataIndex: 'type',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'mode',
        dataIndex: 'mode',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'value',
        dataIndex: 'value',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      }
    ];
    return (
      <div className="service-info" >
        <div className="common-header">
          <Radio.Group buttonStyle="solid" className="service-radio">
            <Radio.Button value="all">{intl.get('service.all')}</Radio.Button>
            <Radio.Button value="storage">Storage</Radio.Button>
            <Radio.Button value="graph">Graph</Radio.Button>
            <Radio.Button value="meta">Meta</Radio.Button>
          </Radio.Group>
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

export default  ConfigInfo;
