import _ from 'lodash';
import React from 'react';
import { Radio, Table } from 'antd';
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
});
interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>{
}
class ConfigInfo extends React.Component<IProps> {

  componentDidMount(){
    this.props.asyncGetServiceConfigs();
  }

  handleModuleChange= e => {
    trackEvent('service-info', 'click_module');
    this.props.asyncGetServiceConfigs(e.target.value);
  }

  render() {
    const { configs, loading } = this.props;
    const columns = [
      {
        title: <TitleInstruction title="Module" description={intl.get('description.module')} />,
        dataIndex: 'module',
        render: module => <span className={`module ${module.toLowerCase()}`}>{module}</span>,
      },
      {
        title: <TitleInstruction title="Name" description={intl.get('description.moduleName')} />,
        dataIndex: 'name',
      },
      {
        title: <TitleInstruction title="Type" description={intl.get('description.moduleType')} />,
        dataIndex: 'type',
      },
      {
        title: <TitleInstruction title="Value" description={intl.get('description.moduleValue')} />,
        dataIndex: 'value',
      }
    ];
    return (
      <div className="service-info service-configs" >
        <div className="common-header">
          <Radio.Group buttonStyle="solid" defaultValue="all" className="service-radio" onChange={this.handleModuleChange}>
            <Radio.Button value="all">{intl.get('service.all')}</Radio.Button>
            <Radio.Button value="storage">Storage</Radio.Button>
            <Radio.Button value="graph">Graph</Radio.Button>
            {/* TODO: Nebula 2.0.1 does not support meta modifications, support can be released in later versions
            <Radio.Button value="meta">Meta</Radio.Button>
            */}
          </Radio.Group>
        </div>
        <Table
          loading={!!loading}
          rowKey={(record: any) => record.module + record.name}
          dataSource={configs} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ConfigInfo);
