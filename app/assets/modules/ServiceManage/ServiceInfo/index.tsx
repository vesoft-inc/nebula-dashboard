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

class ServiceInfo extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.state = {
      data: [
        {
          id:'id1',
          ip:'172.23.3.5',
          port: '9699',
          status: 'online',
          module: 'Storage',
          git: 'f8cbb0',
          leaderCount: 66,
          partitionDistribution: 'space1:33;space2:33',
          leaderDistribution:'god:1'
        },
        {
          id:'id2',
          ip:'172.23.3.5',
          port: '9699',
          status: 'offline',
          module: 'Graph',
          git: 'f8cbb0',
          leaderCount: 66,
          partitionDistribution: 'space1:33;space2:33',
          leaderDistribution:'god:1'
        },
        {
          id:'id3',
          ip:'172.23.3.5',
          port: '9699',
          status: 'online',
          module: 'Meta',
          git: 'f8cbb0',
          leaderCount: 66,
          partitionDistribution: 'space1:33;space2:33',
          leaderDistribution:'god:1'
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
    const {data} = this.state;
    const columns =[
      {
        title: 'IP',
        dataIndex: 'ip',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Port',
        dataIndex: 'port',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render:status => <span className={status}>{status}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Module',
        dataIndex: 'module',
        render:module => <span className={`module ${module.toLowerCase()}`}>{module}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Git Info Sha',
        dataIndex: 'git',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader Count ',
        dataIndex: 'leaderCount',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Partition Distribution',
        dataIndex: 'partitionDistribution',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader Distribution',
        dataIndex: 'leaderDistribution',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
    ];
    return (
      <div className="service-info" >
        <div className="common-header">
          <p className="service-type">{intl.get('service.type')}:</p>
          <Radio.Group buttonStyle="solid" className="service-info-radio">
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
          pagination={false}
          summary={(pageDate) => {
            let total = 0;
            pageDate.forEach(({ leaderCount }) => {
              total += leaderCount;
            });
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={1}>{intl.get('service.total')}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>{total}</Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>-</Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}/>
      </div>
    );
  }
}

export default  ServiceInfo;
