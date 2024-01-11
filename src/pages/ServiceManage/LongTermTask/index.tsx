import _ from 'lodash';
import { useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import intl from 'react-intl-universal';

import { IDispatch, IRootState } from '@/store';
import { TitleInstruction } from '@/components/Instruction';
import { compareVersion, getDefaultNebulaVersion, getVersion } from '@/utils/dashboard';
import SelectSpace from '../SelectSpace';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetJobs,
  jobs: state.nebula.jobs,
  spaces: state.nebula.spaces,
  currentSpace: state.nebula.currentSpace,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetJobs: dispatch.nebula.asyncGetJobs,
});
interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
      cluster: any;
    }

const LongTermTask: React.FC<IProps> = props => {
  const { currentSpace, jobs, loading, cluster = {} } = props;

  useEffect(() => {
    init();
  }, [currentSpace])

  const init = async () => {
    // HAKC: Compatible processing version 2.6.0
    if (compareVersion(getVersion(cluster?.version || getDefaultNebulaVersion()), '2.6.0') >= 0) {
      if (currentSpace) {
        props.asyncGetJobs();
      }
    } else {
      props.asyncGetJobs();
    }
  };

  const renderTime = time => (
    <span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>
  );

  const columns = [
    {
      title: (
        <TitleInstruction
          title="Job ID"
          description={intl.get('description.jobId')}
        />
      ),
      dataIndex: 'Job Id',
    },
    {
      title: (
        <TitleInstruction
          title="Command"
          description={intl.get('description.command')}
        />
      ),
      dataIndex: 'Command',
    },
    {
      title: (
        <TitleInstruction
          title="Status"
          description={intl.get('description.longTermStatus')}
        />
      ),
      dataIndex: 'Status',
      render: status => (
        <span className={`${status.toLowerCase()}`}>{status}</span>
      ),
    },
    {
      title: (
        <TitleInstruction
          title="Start Time"
          description={intl.get('description.longTermStartTime')}
        />
      ),
      dataIndex: 'Start Time',
      render: time => renderTime(time),
    },
    {
      title: (
        <TitleInstruction
          title="Stop Time"
          description={intl.get('description.longTermStopTime')}
        />
      ),
      dataIndex: 'Stop Time',
      render: time => renderTime(time),
    },
  ];

  useEffect(() => {
    if (cluster?.id) {
      init();
    }
  }, [cluster]);

  return (
    <div className="service-info long-task">
      {cluster.id && compareVersion(getVersion(cluster.version), '2.6.0') >= 0 && (
        <div className="common-header">
          <div className="select-space">
            <span>{intl.get('service.spaces')}:</span>
            <SelectSpace />
          </div>
        </div>
      )}
      <Table
        loading={!!loading}
        rowKey={(record: any) => record['Job Id']}
        dataSource={jobs}
        columns={columns}
      />
    </div>
  );
};

export default connect(mapState, mapDispatch)(LongTermTask);
