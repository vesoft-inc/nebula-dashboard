import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Radio, Input, Table, Spin } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { IDispatch, IRootState } from '@/store';
import { TitleInstruction } from '@/components/Instruction';
import { trackEvent } from '@/utils/stat';
import './index.less';
import { ServiceName } from '@/utils/interface';
import { getConfigData } from '@/utils/dashboard';

const mapState = (state: IRootState) => ({
  loading: !!state.loading.effects.nebula.asyncGetServiceConfigs as boolean,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetServiceConfigs: dispatch.nebula.asyncGetServiceConfigs,
} as any);
interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> { }
const NebulaConfig: React.FC<IProps> = (props: IProps) => {
  const [name, setName] = useState('');

  const [configData, setConfigData] = useState<any[]>([]);

  useEffect(() => {
    asyncFetchConfigInfo(ServiceName.GRAPHD);
  }, [])

  const handleModuleChange = e => {
    trackEvent('service-info', 'click_module');
    setConfigData([]);
    asyncFetchConfigInfo(e.target.value as ServiceName);
  };

  const asyncFetchConfigInfo = async (component: ServiceName) => {
    const data = await props.asyncGetServiceConfigs(component);
    setConfigData(getConfigData(data));
  }

  const getData = () => {
    if (!name) {
      return configData;
    }
    return configData.filter((config: any) => config.name.includes(name));
  };

  const { loading } = props;
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
      <Spin spinning={loading}>
        <div className="common-header">
          <Radio.Group
            buttonStyle="solid"
            defaultValue={ServiceName.GRAPHD}
            className="service-radio"
            onChange={handleModuleChange}
          >
            <Radio.Button value={ServiceName.METAD}>Meta</Radio.Button>
            <Radio.Button value={ServiceName.STORAGED}>Storage</Radio.Button>
            <Radio.Button value={ServiceName.GRAPHD}>Graph</Radio.Button>
          </Radio.Group>
          <Input
            placeholder={intl.get('common.configTip')}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <Table
          rowKey={(record: any) => record.value + record.name}
          dataSource={getData()}
          columns={columns}
        />
      </Spin>
    </div>
  );
}

export default connect(mapState, mapDispatch)(NebulaConfig);
