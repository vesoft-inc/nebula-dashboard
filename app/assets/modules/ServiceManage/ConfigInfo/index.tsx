import _ from 'lodash';
import React from 'react';
import { Radio,Table,Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import Icon from '@assets/components/Icon';
import { IDispatch, IRootState } from '@assets/store';

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

  componentDidMount (){
    this.props.asyncGetServiceConfigs();
  }

  renderTooltip=text => {
    return <Tooltip placement="top" title={text} >
      <Icon icon="#iconhelp"/>
    </Tooltip>;
  }

  handleChangeModule= e => {
    this.props.asyncGetServiceConfigs(e.target.value);
  }

  render () {
    const { configs, loading }=this.props;
    const columns =[
      {
        title: 'module',
        dataIndex: 'module',
        render: module => <span className={`module ${module.toLowerCase()}`}>{module}</span>,
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'name',
        dataIndex: 'name',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'type',
        dataIndex: 'type',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'mode',
        dataIndex: 'mode',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      },
      {
        title: 'value',
        dataIndex: 'value',
        filterDropdown: (<div />), 
        filterIcon: this.renderTooltip('文案未定'),
      }
    ];
    return (
      <div className="service-info service-configs" >
        <div className="common-header">
          <Radio.Group buttonStyle="solid" className="service-radio" onChange={this.handleChangeModule}>
            <Radio.Button value="all">{intl.get('service.all')}</Radio.Button>
            <Radio.Button value="storage">Storage</Radio.Button>
            <Radio.Button value="graph">Graph</Radio.Button>
            <Radio.Button value="meta">Meta</Radio.Button>
          </Radio.Group>
        </div>
        <Table
          loading={!!loading}
          rowKey={(record: any) => record.module+record.name}
          dataSource={configs} 
          columns={columns} 
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ConfigInfo);
