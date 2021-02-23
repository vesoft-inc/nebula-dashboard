import _ from 'lodash';
import React from 'react';
import { Table,Tooltip } from 'antd';
import { connect } from 'react-redux';
import Icon from '@assets/components/Icon';
import { IDispatch, IRootState } from '@assets/store';

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

  componentDidMount (){
    this.props.asyncGetJobs();
  }

  renderTooltip= text => {
    return <Tooltip placement="top" title={text} > 
      <Icon icon="#iconhelp"/>
    </Tooltip>;
  }

  renderTime= time => {
    return <span>{time.year/time.month/time.day}{time.hour}:{time.minute}:{time.sec}</span>;
  }

  render () {
    const { jobs,loading } = this.props;
    const columns =[
      {
        title: 'Job ID',
        dataIndex: 'Job Id',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Command',
        dataIndex: 'Command',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        render: status => <span className={`${status.toLowerCase()}`}>{status}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Start Time',
        dataIndex: 'Start Time',
        render: time => this.renderTime(time),
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'Stop Time',
        dataIndex: 'Stop Time',
        render: time => this.renderTime(time),
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
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
