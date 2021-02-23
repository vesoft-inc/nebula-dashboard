import _ from 'lodash';
import React from 'react';
import { Table,Tooltip } from 'antd';
import Icon from '@assets/components/Icon';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetSnapshots,
  snapshots: state.nebula.snapshots,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetSnapshots: dispatch.nebula.asyncGetSnapshots,
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}

class Snapshot extends React.Component<IProps> {

  componentDidMount (){
    this.props.asyncGetSnapshots();
  }

  renderTooltip=text => {
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>;
  }

  render () {
    const { snapshots,loading } = this.props;
    const columns =[
      {
        title: 'Name',
        dataIndex: 'Name',
        width:'30%',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        width:'30%',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Hosts',
        dataIndex: 'Hosts',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
    ];
    return (
      <div className="service-info" >
        <Table
          loading={!!loading}
          rowKey={(record: any) => record.Name}
          dataSource={snapshots} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Snapshot);
