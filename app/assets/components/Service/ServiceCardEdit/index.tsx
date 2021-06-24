import React from 'react';
<<<<<<< HEAD
import { Button, Form, InputNumber } from 'antd';
=======
import { Button, Form, Popover } from 'antd';
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
import { FormInstance } from 'antd/lib/form';
import { TIME_INTERVAL_OPTIONS } from '@assets/utils/dashboard';
import { SERVICE_SUPPORT_METRICS } from '@assets/utils/promQL';
import Icon from '@assets/components/Icon';
import { cloneDeep } from 'lodash';
import intl from 'react-intl-universal';
import { DashboardSelect, Option } from '@assets/components/DashboardSelect';
import { MetricPopover } from '@assets/components/MetricPopover';
import { IServicePanelConfig } from '@assets/utils/interface';

import './index.less';
interface IProps {
  editType: string,
  editIndex: number,
  panelConfig: {
    graph: IServicePanelConfig[],
    storage: IServicePanelConfig[],
    meta: IServicePanelConfig[],
  }
  onClose: () => void;
  onPanelConfigUpdate:(values)=> void;
}

class ServiceCardEdit extends React.Component<IProps> {
  formRef = React.createRef<FormInstance>();
  handleUpdateMetricType = (value: string) => {
    const { editType } = this.props;
    const metricTypeList = SERVICE_SUPPORT_METRICS[editType].filter(item => item.metric === value)[0].metricType;
    this.formRef.current!.setFieldsValue({
      metricFunction: metricTypeList[0].value
    });
  }
  handlePanelConfigUpdate = (values: any) => {
    const { period, metric, metricFunction, baseLine } = values;
    const { editType, panelConfig, editIndex } = this.props;
    const metricTypeList = SERVICE_SUPPORT_METRICS[editType].filter(item => item.metric === metric)[0].metricType;
    const metricType = metricTypeList.filter(type => type.value === metricFunction)[0].key;
    const _config = cloneDeep(panelConfig);
    _config[editType][editIndex] = {
      period,
      metric,
      metricFunction,
      metricType,
      baseLine
    };
    this.props.onPanelConfigUpdate(_config);
    localStorage.setItem('panelConfig', JSON.stringify(_config));
    this.props.onClose();
  }
  render() {
<<<<<<< HEAD
    const { editIndex, editType, panelConfig, onClose } = this.props;
    const editItem = panelConfig[editType][editIndex];
=======
    const { editIndex, editType, servicePanelConfig, onClose } = this.props;
    const editItem = servicePanelConfig[editType][editIndex];
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    return (
      <div className="service-card-edit">
        <Form
          ref={this.formRef}
          initialValues={editItem} 
          onFinish={this.handlePanelConfigUpdate}
        >
          <Form.Item label={intl.get('service.period')} name="period">
            <DashboardSelect>
              {
                TIME_INTERVAL_OPTIONS.map(value => (
                  <Option key={value} value={value}>{value}</Option>
                ))
              }
            </DashboardSelect>
          </Form.Item>
<<<<<<< HEAD
          <MetricPopover list={SERVICE_SUPPORT_METRICS[editType]}/>
=======
          <Popover content="metric docs">
            <Icon className="metric-info-icon blue" icon="#iconnav-serverInfo" />
          </Popover>
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
          <Form.Item label={intl.get('service.metric')} name="metric">
            <DashboardSelect onChange={this.handleUpdateMetricType}>
              {
                SERVICE_SUPPORT_METRICS[editType].map(metric => (
                  <Option key={metric.metric} value={metric.metric}>{metric.metric}</Option>
                ))
              }
            </DashboardSelect>
          </Form.Item>

          <Form.Item
            noStyle={true}
            shouldUpdate={(prevValues, currentValues) => prevValues.metric !== currentValues.metric}
          >
            {({ getFieldValue }) => {
              const metric = getFieldValue('metric');
              const typeList = SERVICE_SUPPORT_METRICS[editType].filter(item => item.metric === metric)[0].metricType;
              return getFieldValue('metric') ? <Form.Item label={intl.get('service.metricParams')} name="metricFunction">
                <DashboardSelect>
                  {
                    typeList.map(params => (
                      <Option key={params.key} value={params.value}>{params.key}</Option>
                    ))
                  }
                </DashboardSelect>
              </Form.Item> : null;}
            }
          </Form.Item>
          <Form.Item label={intl.get('common.baseLine')} name="baseLine" >
            <InputNumber min={0}/>
          </Form.Item>
          <div className="footer-btns">
            <Button htmlType="button" onClick={onClose}>
              {intl.get('common.cancel')}
            </Button>
            <Button 
              data-track-category="service_card"
              data-track-action="confirm_edit"
              data-track-label={`from_${editType}`}
              type="primary" 
              htmlType="submit"
            >
              {intl.get('common.confirm')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default ServiceCardEdit;