import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { compare } from 'compare-versions';
import dayjs from 'dayjs';
import { IDispatch, IRootState } from '@/store';
import { TitleInstruction } from '@/components/Instruction';
import { DashboardSelect } from '@/components/DashboardSelect';
import { getVersion } from '@/utils/dashboard';
import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetJobs,
  jobs: state.nebula.jobs,
  version: state.nebula.version,
  spaces: state.nebula.spaces,
  currentSpace: state.nebula.currentSpace,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetJobs: dispatch.nebula.asyncGetJobs,
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
  updateSpace: space =>
    dispatch.nebula.update({
      currentSpace: space,
    }),
});
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {}

class LongTermTask extends React.Component<IProps> {
  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { version, currentSpace } = this.props;
    // HAKC: Compatible processing version 2.6.0
    if (compare(getVersion(version), '2.6.0', '>=')) {
      await this.props.asyncGetSpaces();
      if (currentSpace) {
        this.props.asyncGetJobs();
      }
    } else {
      this.props.asyncGetJobs();
    }
  };

  renderTime = time => <span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>;

  handleSpaceChange = async space => {
    const { code } = await this.props.asyncUseSpaces(space);
    if (code === 0) {
      await this.props.updateSpace(space);
      await this.props.asyncGetJobs();
    }
  };

  render() {
    const { jobs, version, currentSpace, spaces, loading } = this.props;
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
        render: time => this.renderTime(time),
      },
      {
        title: (
          <TitleInstruction
            title="Stop Time"
            description={intl.get('description.longTermStopTime')}
          />
        ),
        dataIndex: 'Stop Time',
        render: time => this.renderTime(time),
      },
    ];
    return (
      <div className="service-info long-task">
        {version && compare(getVersion(version), '2.6.0', '>=') && (
          <div className="common-header">
            <div className="select-space">
              <span>{intl.get('service.spaces')}:</span>
              <DashboardSelect
                placeholder={intl.get('service.chooseSpace')}
                value={currentSpace || undefined}
                onChange={this.handleSpaceChange}
                style={{
                  width: 220,
                }}
              >
                {spaces.map((space: any) => (
                  <Option value={space.Name} key={space.Name}>
                    {space.Name}
                  </Option>
                ))}
                s
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
  }
}

export default connect(mapState, mapDispatch)(LongTermTask);
