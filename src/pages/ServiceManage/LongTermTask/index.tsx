import _ from 'lodash';
import React, { useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import { IDispatch, IRootState } from '@/store';
import intl from 'react-intl-universal';
import { TitleInstruction } from '@/components/Instruction';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { compareVersion, DEFAULT_VERSION, getVersion } from '@/utils/dashboard';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetJobs,
  jobs: state.nebula.jobs,
  spaces: state.nebula.spaces,
  currentSpace: state.nebula.currentSpace,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetJobs: dispatch.nebula.asyncGetJobs,
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
});
interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {}

const LongTermTask: React.FC<IProps> = props => {
  const { currentSpace, spaces, jobs, loading, cluster = {} } = props;

  const handleSpaceChange = async space => {
    const { code } = await props.asyncUseSpaces(space);
    if (code === 0) {
      await props.asyncGetJobs();
    }
  };

  const init = async () => {
    // HAKC: Compatible processing version 2.6.0
    if (compareVersion(getVersion(cluster?.version || DEFAULT_VERSION), '2.6.0') >= 0) {
      await props.asyncGetSpaces();
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
            <DashboardSelect
              placeholder={intl.get('service.chooseSpace')}
              value={currentSpace || undefined}
              onChange={handleSpaceChange}
              style={{
                width: 220,
              }}
            >
              {spaces.map((space: any) => (
                <Option value={space.Name} key={space.Name}>
                  {space.Name}
                </Option>
              ))}
            </DashboardSelect>
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
