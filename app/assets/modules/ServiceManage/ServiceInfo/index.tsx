import _ from 'lodash';
import React from 'react';
import { Table,Tooltip } from 'antd';
import { connect } from 'react-redux';
import Icon from '@assets/components/Icon';
import { IDispatch, IRootState } from '@assets/store';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetServices,
  services: state.nebula.services,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetServices: dispatch.nebula.asyncGetServices,
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}

class ServiceInfo extends React.Component<IProps> {

  componentDidMount (){
    this.props.asyncGetServices();
  }

  renderTooltip=text => {
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>;
  }

  render () {
    const { services } = this.props;
    const columns =[
      {
        title: 'IP',
        dataIndex: 'Host',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Port',
        dataIndex: 'Port',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        render:status => <span className={status.toLowerCase()}>{status}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Git Info Sha',
        dataIndex: 'Git Info Sha',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader Count ',
        dataIndex: 'Leader count',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Partition Distribution',
        dataIndex: 'Partition distribution',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader Distribution',
        dataIndex: 'Leader distribution',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
    ];
    return (
      <div className="service-info" >
        <Table 
          rowKey={(record: any) => record.Host}
          dataSource={services} 
          columns={columns} 
          pagination={false}
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ServiceInfo);
