import _ from 'lodash';
import React from 'react';
import { Input,Select,Table,Tooltip } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import Icon from '@assets/components/Icon';
import { IDispatch, IRootState } from '@assets/store';
import service from '@assets/config/service';

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

  renderTooltip=text => {
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>;
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
        title: 'Partition ID',
        dataIndex: 'Partition ID',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Leader',
        dataIndex: 'Leader',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Peers',
        dataIndex: 'Peers',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Losts',
        dataIndex: 'Losts',
        render:losts => <span>{losts||'-'}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      }
    ];
    return (
      <div className="service-info service-partition" >
        <div className="common-header">
          <div className="service-screen">
            <span>{intl.get('service.spaces')}:</span>
            <Select 
              className="service-select"
              onChange={this.handleSpaceChange}
              style={{
                width: 120 
              }}>
              {spaces.map((space:any) => {
                return <Select.Option value={space.Name} key={space.Name}>{space.Name}</Select.Option>;
              })}
            </Select>
          </div>
          {}
          {/* TODO: Support service filtering
          <div className="service-screen">
            <span>{intl.get('service.services')}:</span>
            <Select className="service-select" style={{
              width: 120 
            }}>
              {spaces.map(space => {
                return <Select.Option value={space.Name} key={space.Name}>{space.Name}</Select.Option>;
              })}
            </Select>
            </div> */}
          <div className="service-screen">
            <span>{intl.get('service.partition')}:</span>
            <Input.Search allowClear={true}  onSearch={this.handleSearchPartitionId} />
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
