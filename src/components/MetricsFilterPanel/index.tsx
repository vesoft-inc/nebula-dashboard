import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { Form, FormInstance, Select, TreeSelect } from 'antd';
import intl from 'react-intl-universal';

import { INTERVAL_FREQUENCY_LIST } from '@/utils/service';
import TimeSelect from '../TimeSelect';

import styles from './index.module.less';
import { TIME_OPTION_TYPE } from '@/utils/dashboard';


interface IProps {
  instanceList: string[];
  onChange?: (values) => void;
  children?: React.ReactNode;
  initialValues?: any;
  values?: any;
}

const MetricsFilterPanel = (props: IProps, ref) => {

  const { instanceList, onChange, children, values = {} } = props;

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

  const handleInstanceChange = (value)=> {
    form.setFieldsValue({
      instances: value,
    });
    onChange?.(form.getFieldsValue());
  }

  useImperativeHandle(ref, () => ({
    getForm: (): FormInstance<any> => form,
  }))

  return (
    <Form
      className={styles.metricsFilterPanel}
      form={form}
      layout="inline"
      onChange={handleFormChange}
    >
      <Form.Item name="timeRange">
        <TimeSelect onChange={handleTimeSelectChange}/>
      </Form.Item>
      <Form.Item name="frequency" label={intl.get('common.updateFrequency')}
      >
        <Select
          className={styles.frequencySelect}
          onChange={handleFrequencyChange}
        >
          {
            INTERVAL_FREQUENCY_LIST.map(item => (
              <Select.Option key={item.value} value={item.value}>{item.type}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{
      }} name="instanceList" label={intl.get('common.metricLabel')}>
        <TreeSelect 
          style={{ minWidth: '250px', maxWidth: '500px' }} 
          treeData={treeData} treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          onChange={handleInstanceChange}
        />
      </Form.Item>
      {
        children ? children: null
      }
    </Form>
  )
}

export default forwardRef(MetricsFilterPanel);