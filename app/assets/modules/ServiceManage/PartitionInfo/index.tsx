import _ from 'lodash';
import React from 'react';
import { Input, Table } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { IDispatch, IRootState } from '@assets/store';
import service from '@assets/config/service';
import { DashboardSelect, Option } from '@assets/components/DashboardSelect';
import { TitleInstruction } from '@assets/components/Instruction';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetParts,
  spaces: state.nebula.spaces,
  parts: state.nebula.parts,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncGetParts: dispatch.nebula.asyncGetParts,
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}

class PartitionInfo extends React.Component<IProps> {

  componentDidMount (){
    this.props.asyncGetSpaces();
  }

  handleSpaceChange= async space => {
    const { code } = (await service.execNGQL({
      gql: `USE ${space}`
    })) as any;
    if(code === 0){
      this.props.asyncGetParts();
    }
  }

  handleSearchPartitionId = value => {
    this.props.asyncGetParts(value);
  }

  render () {
    const { spaces, parts, loading } = this.props;
    const columns =[
      {
        title: <TitleInstruction title="Module" description={intl.get('description.module')} />,
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
        render: losts => <span>{losts||'-'}</span>,
      }
    ];
    return (
      <div className="service-info service-partition" >
        <div className="common-header">
          <div className="service-screen">
            <span>{intl.get('service.spaces')}:</span>
            <DashboardSelect 
              className="service-select"
              onChange={this.handleSpaceChange}
              style={{
                width: 120 
              }}>
              {spaces.map((space:any) => {
                return <Option value={space.Name} key={space.Name}>{space.Name}</Option>;
              })}
            </DashboardSelect>
          </div>
          <div className="service-screen">
            <span>{intl.get('service.partition')}:</span>
            <Input.Search allowClear={true} onSearch={this.handleSearchPartitionId} />
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
