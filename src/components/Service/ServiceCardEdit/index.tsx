import React, { useMemo, useRef } from 'react';
import { Button, Form, InputNumber } from 'antd';
// import { FormInstance } from 'antd/lib/form';
import { cloneDeep } from 'lodash';
import intl from 'react-intl-universal';
import { TIME_INTERVAL_OPTIONS } from '@/utils/dashboard';
import { DashboardSelect, Option } from '@/components/DashboardSelect';
import { MetricPopover } from '@/components/MetricPopover';
import { IPanelConfig, IServiceMetricItem, ServiceName } from '@/utils/interface';

import './index.less';

interface IProps {
  editType: ServiceName;
  editIndex: number;
  serviceMetric: any;
  panelConfig: IPanelConfig;
  onClose: () => void;
  onPanelConfigUpdate: (values) => void;
}

function ServiceCardEdit(props: IProps) {

  const { editIndex, editType, serviceMetric, panelConfig, onClose, onPanelConfigUpdate } = props;

  const formRef = useRef<any>();

  const curServiceMetricItems = useMemo<IServiceMetricItem[]>(() => serviceMetric[editType], [serviceMetric, editType]);

  const handleUpdateMetricType = (value: string) => {
    const metric = curServiceMetricItems.find(
      item => item.metric === value,
    );
    formRef.current.setFieldsValue({
      aggregation: metric?.aggregations[0],
      space: '',
    });
  };

  const handlePanelConfigUpdate = (values: any) => {
    const { period, space, metric, aggregation, baseLine } = values;
    // const metricTypeList = curServiceMetricItems.find(
    //   item => item.metric === metric,
    // )?.aggregations;
    // const metricType = metricTypeList?.find(
    //   type => type === aggregation,
    // );
    const _config = cloneDeep(panelConfig);
    _config[editType][editIndex] = {
      period,
      metric,
      aggregation,
      baseLine,
      space,
    };
    onPanelConfigUpdate(_config);
    localStorage.setItem('panelConfig', JSON.stringify(_config));
    onClose();
  };

  const editItem = useMemo(() =>
    panelConfig[editType][editIndex],
    [panelConfig, editType, editIndex]);

  return (
    <div className="service-card-edit">
      <Form
        ref={(ref) => formRef.current = ref}
        initialValues={editItem}
        onFinish={handlePanelConfigUpdate}
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
        <MetricPopover list={curServiceMetricItems} />
        <Form.Item label={intl.get('service.metric')} name="metric">
          <DashboardSelect onChange={handleUpdateMetricType}>
            {curServiceMetricItems?.map(metric => (
              <Option key={metric.metric} value={metric.metric}>
                {metric.metric}
              </Option>
            ))}
          </DashboardSelect>
        </Form.Item>
        <Form.Item
          noStyle={true}
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.metric !== currentValues.metric
          }
        >
          {({ getFieldValue }) => {
            const metric = getFieldValue('metric');
            const isSpaceMetric = curServiceMetricItems.find(
              item => item.metric === metric,
            )?.isSpaceMetric;
            return metric && isSpaceMetric ? (
              <Form.Item label={intl.get('service.spaces')} name="space">
                <DashboardSelect>
                  <Option key="all" value="">
                    {intl.get('common.all')}
                  </Option>
                  {serviceMetric.spaces?.map(space => (
                    <Option key={space} value={space}>
                      {space}
                    </Option>
                  ))}
                </DashboardSelect>
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item
          noStyle={true}
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.metric !== currentValues.metric
          }
        >
          {({ getFieldValue }) => {
            const metric = getFieldValue('metric');
            const typeList = curServiceMetricItems.find(
              item => item.metric === metric,
            )?.aggregations;
            return getFieldValue('metric') ? (
              <Form.Item
                label={intl.get('service.metricParams')}
                name="aggregation"
              >
                <DashboardSelect>
                  {typeList?.map((params, index) => (
                    <Option key={index} value={params}>
                      {params}
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

export default ServiceCardEdit;
