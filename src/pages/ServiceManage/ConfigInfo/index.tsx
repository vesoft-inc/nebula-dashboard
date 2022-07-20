import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Radio,Input, Table } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import { TitleInstruction } from '@/components/Instruction';
import { trackEvent } from '@/utils/stat';
import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetServiceConfigs,
  configs: state.nebula.configs,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetServiceConfigs: dispatch.nebula.asyncGetServiceConfigs,
}) as any;
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {}
const NebulaConfig: React.FC<IProps> = (props: IProps) => {
  const [name, setName] = useState('');
  
  useEffect(()=>{
    props.asyncGetServiceConfigs('graph');
  },[])

  const handleModuleChange = e => {
    trackEvent('service-info', 'click_module');
    props.asyncGetServiceConfigs(e.target.value);
  };

  const getData = () => {
    if (!name) {
      return configs;
    }
    return configs.filter((config: any) => config.name.includes(name));
  };

  const { configs, loading } = props;
  const columns = [
    {
      title: (
        <TitleInstruction
          title="Name"
          description={intl.get('description.moduleName')}
        />
      ),
      dataIndex: 'name',
    },
    {
      title: (
        <TitleInstruction
          title="Value"
          description={intl.get('description.moduleValue')}
        />
      ),
      dataIndex: 'value',
    },
  ];
  return (
    <div className="service-info service-configs">
      <div className="common-header">
        <Radio.Group
          buttonStyle="solid"
          defaultValue="graph"
          className="service-radio"
          onChange={handleModuleChange}
        >
          <Radio.Button value="storage">Storage</Radio.Button>
          <Radio.Button value="graph">Graph</Radio.Button>
          {/* TODO: Nebula 2.0.1 does not support meta modifications, support can be released in later versions
          <Radio.Button value="meta">Meta</Radio.Button>
          */}
        </Radio.Group>
        <Input
          placeholder={intl.get('common.configTip')}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <Table
        loading={!!loading}
        rowKey={(record: any) => record.value + record.name}
        dataSource={getData()}
        columns={columns}
      />
    </div>
  );
}

export default connect(mapState, mapDispatch)(NebulaConfig);
