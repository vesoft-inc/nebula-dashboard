import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { Form, FormInstance, Select, TreeSelect } from 'antd';
import intl from 'react-intl-universal';

import { INTERVAL_FREQUENCY_LIST } from '@/utils/service';
import TimeSelect from '../TimeSelect';

import styles from './index.module.less';
import { TIME_OPTION_TYPE } from '@/utils/dashboard';
import Icon from '../Icon';
import { isCloudVersion } from '@/utils';


export function FrequencySelect(props: { value?, onChange?, handleRefresh?}) {
  const { value, onChange, handleRefresh } = props;
  return (
    <div className={styles.frequency}>
      <div onClick={handleRefresh} className={styles.freshIcon}><Icon className={styles.freshIconItem} icon="#iconrefresh" /></div>
      <Select
        className={styles.frequencySelect}
        onChange={onChange}
        value={value}
      >
        {
          INTERVAL_FREQUENCY_LIST.map(item => (
            <Select.Option key={item.value} value={item.value}>{item.type}</Select.Option>
          ))
        }
      </Select>
    </div>
  )
}

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

  const handleTimeSelectChange = (value: TIME_OPTION_TYPE | number[]) => {
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
              style={{ minWidth: '250px', maxWidth: '500px' }}
              treeData={treeData} treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
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
          <Form.Item name="metrics" label={intl.get('common.metric')} wrapperCol={{span: 18}}>
            <Select 
              allowClear
              className={styles.metricSelect} 
              mode="multiple" 
              placeholder={intl.get('base.searchMetric')}
              onChange={handleMetricsSelectChange}
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