import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import intl from 'react-intl-universal';
import { TitleInstruction } from '@/components/Instruction';
import dayjs from 'dayjs';
import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetJobs,
  jobs: state.nebula.jobs,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetJobs: dispatch.nebula.asyncGetJobs,
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}

class LongTermTask extends React.Component<IProps> {

  componentDidMount(){
    this.props.asyncGetJobs();
  }

  renderTime= time => {  
    return <span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>;
  }

  render() {
    const { jobs, loading } = this.props;
    const columns = [
      {
        title: <TitleInstruction title="Job ID" description={intl.get('description.jobId')} />,
        dataIndex: 'Job Id',
      },
      {
        title: <TitleInstruction title="Command" description={intl.get('description.command')} />,
        dataIndex: 'Command',
      },
      {
        title: <TitleInstruction title="Status" description={intl.get('description.longTermStatus')} />,
        dataIndex: 'Status',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
      },
      {
        title: <TitleInstruction title="Start Time" description={intl.get('description.longTermStartTime')} />,
        dataIndex: 'Start Time',
        render: time => this.renderTime(time),
      },
      {
        title: <TitleInstruction title="Stop Time" description={intl.get('description.longTermStopTime')} />,
        dataIndex: 'Stop Time',
        render: time => this.renderTime(time),
      },
    ];
    return (
      <div className="service-info" >
        <Table
          loading={!!loading}
          rowKey={(record: any) => record['Job Id']}
          dataSource={jobs} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(LongTermTask);
