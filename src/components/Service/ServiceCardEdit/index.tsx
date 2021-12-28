import React from 'react';
import { Button, Form, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { TIME_INTERVAL_OPTIONS } from '@/utils/dashboard';
import { cloneDeep } from 'lodash';
import intl from 'react-intl-universal';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { MetricPopover } from '@/components/MetricPopover';
import { IServicePanelConfig } from '@/utils/interface';

import './index.less';

interface IProps {
  editType: string;
  editIndex: number;
  serviceMetric: any[];
  panelConfig: {
    graph: IServicePanelConfig[];
    storage: IServicePanelConfig[];
    meta: IServicePanelConfig[];
  };
  onClose: () => void;
  onPanelConfigUpdate: (values) => void;
}

class ServiceCardEdit extends React.Component<IProps> {
  formRef = React.createRef<FormInstance>();

  handleUpdateMetricType = (value: string) => {
    const { serviceMetric, editType } = this.props;
    const metricTypeList = serviceMetric[`${editType}d`].filter(
      item => item.metric === value,
    )[0].metricType;
    this.formRef.current!.setFieldsValue({
      metricFunction: metricTypeList[0].value,
    });
  };

  handlePanelConfigUpdate = (values: any) => {
    const { period, metric, metricFunction, baseLine } = values;
    const { editType, panelConfig, serviceMetric, editIndex } = this.props;
    const metricTypeList = serviceMetric[`${editType}d`].filter(
      item => item.metric === metric,
    )[0].metricType;
    const metricType = metricTypeList.filter(
      type => type.value === metricFunction,
    )[0].key;
    const _config = cloneDeep(panelConfig);
    _config[editType][editIndex] = {
      period,
      metric,
      metricFunction,
      metricType,
      baseLine,
    };
    this.props.onPanelConfigUpdate(_config);
    localStorage.setItem('panelConfig', JSON.stringify(_config));
    this.props.onClose();
  };

  render() {
    const { editIndex, editType, serviceMetric, panelConfig, onClose } = this.props;
    const editItem = panelConfig[editType][editIndex];
    console.log(serviceMetric[`${editType}d`],22222)
    return (
      <div className="service-card-edit">
        <Form
          ref={this.formRef}
          initialValues={editItem}
          onFinish={this.handlePanelConfigUpdate}
        >
          <Form.Item label={intl.get('service.period')} name="period">
            <DashboardSelect>
              {TIME_INTERVAL_OPTIONS.map(value => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </DashboardSelect>
          </Form.Item>
          <MetricPopover list={serviceMetric[`${editType}d`]} />
          <Form.Item label={intl.get('service.metric')} name="metric">
            <DashboardSelect onChange={this.handleUpdateMetricType}>
              {serviceMetric[`${editType}d`].map(metric => (
                <Option key={metric.metric} value={metric.metric}>
                  {metric.metric}
                </Option>
              ))}
            </DashboardSelect>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.metric !== currentValues.metric
            }
          >
            {({ getFieldValue }) => {
              const metric = getFieldValue('metric');
              const typeList = serviceMetric[`${editType}d`].filter(
                item => item.metric === metric,
              )[0]?.metricType;
              return getFieldValue('metric') ? (
                <Form.Item
                  label={intl.get('service.metricParams')}
                  name="metricFunction"
                >
                  <DashboardSelect>
                    {typeList?.map(params => (
                      <Option key={params.key} value={params.value}>
                        {params.key}
                      </Option>
                    ))}
                  </DashboardSelect>
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
          <Form.Item label={intl.get('common.baseLine')} name="baseLine">
            <InputNumber min={0} />
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
