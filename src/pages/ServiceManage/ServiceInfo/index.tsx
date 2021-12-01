import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import { TitleInstruction } from '@/components/Instruction';
import intl from 'react-intl-universal';

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

  componentDidMount(){
    this.props.asyncGetServices();
  }

  render() {
    const { services } = this.props;
    const columns = [
      {
        title: <TitleInstruction title="Host" description={intl.get('description.ip')} />,
        dataIndex: 'Host',
      },
      {
        title: <TitleInstruction title="Port" description={intl.get('description.port')} />,
        dataIndex: 'Port',
      },
      {
        title: <TitleInstruction title="Status" description={intl.get('description.status')} />,
        dataIndex: 'Status',
        render:status => <span className={status.toLowerCase()}>{status}</span>,
      },
      {
        title: <TitleInstruction title="Git Info Sha" description={intl.get('description.gitInfo')} />,
        dataIndex: 'Git Info Sha',
      },
      {
        title: <TitleInstruction title="Leader Count" description={intl.get('description.leaderCount')} />,
        dataIndex: 'Leader count',
      },
      {
        title: <TitleInstruction title="Partition Distribution" description={intl.get('description.partitionDistribution')} />,
        dataIndex: 'Partition distribution',
      },
      {
        title: <TitleInstruction title="Leader Distribution" description={intl.get('description.leaderDistribution')} />,
        dataIndex: 'Leader distribution',
      },
    ];
    return (
      <div className="service-info" >
        <Table 
          rowKey={(record: any) => record.Host}
          dataSource={services} 
          columns={columns} 
          pagination={false}
          tableLayout="fixed"
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ServiceInfo);
