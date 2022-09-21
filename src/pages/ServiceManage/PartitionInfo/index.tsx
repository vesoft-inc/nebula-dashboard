import React, { useEffect } from 'react';
import _ from 'lodash';
import { Input, Table } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';

import { IDispatch, IRootState } from '@/store';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { TitleInstruction } from '@/components/Instruction';
import { trackEvent } from '@/utils/stat';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetParts,
  spaces: state.nebula.spaces,
  parts: state.nebula.parts,
  currentSpace: state.nebula.currentSpace,
  nebulaConnect: state.nebula.nebulaConnect,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncGetParts: dispatch.nebula.asyncGetParts,
  asyncUseSpaces: dispatch.nebula.asyncUseSpaces,
});
interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  isOverview: boolean;
}

const PartitionInfo: React.FC<IProps> = (props: IProps) => {
  const { nebulaConnect, currentSpace, loading, parts, spaces, isOverview } =
    props;

  useEffect(() => {
    if (nebulaConnect) {
      props.asyncGetSpaces();
    }
  }, [nebulaConnect]);

  useEffect(() => {
    if (currentSpace) {
      props.asyncGetParts();
    }
  }, [currentSpace]);

  const handleSpaceChange = async space => {
    const { code } = (await props.asyncUseSpaces(space)) as any;
    if (code === 0) {
      props.asyncGetParts();
      trackEvent('partition_info', 'select_space');
    }
  };

  const handleSearchPartitionId = value => {
    props.asyncGetParts(value);
    trackEvent('partition_info', 'search_partitionId');
  };

  const columns = [
    {
      title: (
        <TitleInstruction
          title="PartitionId"
          description={intl.get('description.partitionId')}
        />
      ),
      dataIndex: 'Partition ID',
    },
    {
      title: (
        <TitleInstruction
          title="Leader"
          description={intl.get('description.leader')}
        />
      ),
      dataIndex: 'Leader',
    },
    {
      title: (
        <TitleInstruction
          title="Peers"
          description={intl.get('description.peers')}
        />
      ),
      dataIndex: 'Peers',
    },
    {
      title: (
        <TitleInstruction
          title="Losts"
          description={intl.get('description.losts')}
        />
      ),
      dataIndex: 'Losts',
      render: losts => <span>{losts || '-'}</span>,
    },
  ];
  return (
    <div className="service-info service-partition">
      {!isOverview && (
        <div className="common-header">
          <div className="service-screen">
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
          <div className="service-screen">
            <span>{intl.get('service.partition')}:</span>
            <Input.Search
              allowClear
              className="text-center"
              placeholder={intl.get('service.enterPartitionId')}
              onSearch={handleSearchPartitionId}
            />
          </div>
        </div>
      )}
      <Table
        loading={!!loading}
        rowKey={(record: any) => record['Partition ID']}
        dataSource={parts}
        columns={columns}
      />
    </div>
  );
};

export default connect(mapState, mapDispatch)(PartitionInfo);
