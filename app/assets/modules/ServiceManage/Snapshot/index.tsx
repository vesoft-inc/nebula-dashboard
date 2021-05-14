import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { TitleInstruction } from '@assets/components/Instruction';

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

  render () {
    const { snapshots, loading } = this.props;
    const columns =[
      {
        title: <TitleInstruction title="Name" description={intl.get('description.snapshotName')} />,
        dataIndex: 'Name',
        width:'30%',
      },
      {
        title: <TitleInstruction title="Status" description={intl.get('description.snapshotStatus')} />,
        dataIndex: 'Status',
        width:'30%',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
      },
      {
        title: <TitleInstruction title="Hosts" description={intl.get('description.snapshotHosts')} />,
        dataIndex: 'Hosts',
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
