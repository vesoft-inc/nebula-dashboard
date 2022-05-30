import _ from 'lodash';
import React from 'react';
import { Input, Table } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { IDispatch, IRootState } from '@assets/store';
import service from '@assets/config/service';
import { DashboardSelect, Option } from '@assets/components/DashboardSelect';
import { TitleInstruction } from '@assets/components/Instruction';
import { trackEvent } from '@assets/utils/stat';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetParts,
  spaces: state.nebula.spaces,
  parts: state.nebula.parts,
  currentSpace:state.nebula.currentSpace,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncGetParts: dispatch.nebula.asyncGetParts,
  updateSpace: space =>
    dispatch.nebula.update({
      currentSpace: space,
    }),
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}

class PartitionInfo extends React.Component<IProps> {

  componentDidMount() {
    this.props.asyncGetSpaces();
  }

  handleSpaceChange= async space => {
    const { code } = (await service.execNGQL({
      gql: `USE ${space}`
    })) as any;
    if(code === 0){
      this.props.asyncGetParts();
      this.props.updateSpace(space);
<<<<<<< HEAD
      trackEvent('partition_info', 'select_space');
=======
>>>>>>> f65a8e5 (fix: issue  (#54))
    }
  }

  handleSearchPartitionId = value => {
    this.props.asyncGetParts(value);
    trackEvent('partition_info', 'search_partitionId');
  }

<<<<<<< HEAD
  render() {
    const { spaces, parts, currentSpace, loading } = this.props;
    const columns = [
=======
  render () {
    const { spaces, parts, currentSpace, loading } = this.props;
    const columns =[
>>>>>>> f65a8e5 (fix: issue  (#54))
      {
        title: <TitleInstruction title="PartitionId" description={intl.get('description.partitionId')} />,
        dataIndex: 'Partition ID',
      },
      {
        title: <TitleInstruction title="Leader" description={intl.get('description.leader')} />,
        dataIndex: 'Leader',
      },
      {
        title: <TitleInstruction title="Peers" description={intl.get('description.peers')} />,
        dataIndex: 'Peers',
      },
      {
        title: <TitleInstruction title="Losts" description={intl.get('description.losts')} />,
        dataIndex: 'Losts',
        render: losts => <span>{losts || '-'}</span>,
      }
    ];
    return (
      <div className="service-info service-partition" >
        <div className="common-header">
          <div className="service-screen">
            <span>{intl.get('service.spaces')}:</span>
            <DashboardSelect 
<<<<<<< HEAD
              placeholder={intl.get('service.chooseSpace')}
              value={currentSpace || undefined}
=======
              className="service-select"
              value={currentSpace||undefined}
>>>>>>> f65a8e5 (fix: issue  (#54))
              onChange={this.handleSpaceChange}
              style={{
                width: 220 
              }}>
              {spaces.map((space:any) => {
                return <Option value={space.Name} key={space.Name}>{space.Name}</Option>;
              })}
            </DashboardSelect>
          </div>
          <div className="service-screen">
            <span>{intl.get('service.partition')}:</span>
            <Input.Search allowClear={true} placeholder={intl.get('service.enterPartitionId')} onSearch={this.handleSearchPartitionId} />
          </div>
        </div>
        <Table 
          loading={!!loading}
          rowKey={(record: any) => record['Partition ID']}
          dataSource={parts} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(PartitionInfo);
