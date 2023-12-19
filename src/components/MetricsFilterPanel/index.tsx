import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { Form, FormInstance, Select, TreeSelect } from 'antd';
import intl from 'react-intl-universal';

import TimeSelect from '@/components/TimeSelect';
import { TIME_OPTION_TYPE } from '@/utils/dashboard';
import { isCloudVersion } from '@/utils';
import FrequencySelect from './FrequencySelect';

import styles from './index.module.less';

interface IProps {
  instanceList: string[];
  onChange?: (values) => void;
  children?: React.ReactNode;
  initialValues?: any;
  values?: any;
  onRefresh?: (values) => void;
  metrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
}

const MetricsFilterPanel = (props: IProps, ref) => {

  const { instanceList, onChange, children, values = {}, onRefresh, metrics, onMetricsChange } = props;

  const [form] = Form.useForm();

  const treeData = useMemo(() => (
    [
      {
        title: 'all',
        value: 'all',
        key: 'all',
        children: instanceList.map(instance => ({
          title: instance,
          value: instance,
          key: instance,
          children: [],
        })),
      }
    ]), [instanceList]);

  const handleFormChange = () => {
    onChange?.(form.getFieldsValue());
  }

  useEffect(() => {
    if (values) {
      form.setFieldsValue(values);
    }
  }, [values])

  const handleTimeSelectChange = (value: TIME_OPTION_TYPE | [number, number]) => {
    form.setFieldsValue({
      timeRange: value,
    });
    onChange?.(form.getFieldsValue());
  }

  const handleFrequencyChange = (value: number) => {
    form.setFieldsValue({
      frequency: value,
    });
    onChange?.(form.getFieldsValue());
  }

  const handleInstanceChange = (value) => {
    form.setFieldsValue({
      instances: value,
    });
    onChange?.(form.getFieldsValue());
  }

  useImperativeHandle(ref, () => ({
    getForm: (): FormInstance<any> => form,
  }))

  const handleRefresh = () => {
    onRefresh?.(form.getFieldsValue())
  }

  const handleMetricsSelectChange = (values) => {
    onMetricsChange?.(values);
  }

  return (
    <Form
      className={styles.metricsFilterPanel}
      form={form}
      layout="inline"
      onChange={handleFormChange}
    >
      <Form.Item name="timeRange">
        <TimeSelect onChange={handleTimeSelectChange} />
      </Form.Item>
      {
        !isCloudVersion() && (
          <Form.Item name="instanceList" label={intl.get('common.metricLabel')}>
            <TreeSelect
              style={{ width: '220px', maxWidth: '500px' }}
              treeData={treeData} treeCheckable
              treeDefaultExpandAll
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              onChange={handleInstanceChange}
            />
          </Form.Item>
        )
      }
      <Form.Item name="frequency" label={intl.get('common.updateFrequency')}
      >
        <FrequencySelect
          onChange={handleFrequencyChange}
          handleRefresh={handleRefresh}
        />
      </Form.Item>
      {
        metrics && (
          <Form.Item label={intl.get('common.metric')} wrapperCol={{ span: 18 }}>
            <Select
              allowClear
              className={styles.metricSelect}
              mode="multiple"
              showSearch
              placeholder={intl.get('base.searchMetric')}
              onChange={handleMetricsSelectChange}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              style={{ minWidth: '250px', maxWidth: '500px' }}>
              {
                metrics.map((metric, i) => (
                  <Select.Option value={metric} key={i}>{metric}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        )
      }
      {
        children ? children : null
      }
    </Form>
  )
}

export default forwardRef(MetricsFilterPanel);