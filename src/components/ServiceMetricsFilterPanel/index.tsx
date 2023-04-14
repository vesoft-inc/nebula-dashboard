import React, { useEffect, useMemo, useRef } from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';

import { ServiceName } from '@/utils/interface';
import MetricsFilterPanel from '../MetricsFilterPanel';
import { DashboardSelect, Option } from '../DashboardSelect';

import styles from './index.module.less';

interface IProps {
  spaces?: string[];
  instanceList: string[];
  onChange?: (values) => void;
  values?: any;
  onRefresh?: (values: any) => void;
  metrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
  serviceTypes?: ServiceName[];
}

function ServiceMetricsFilterPanel(props: IProps) {
  const { spaces, instanceList, onChange, values, onRefresh, metrics, onMetricsChange, serviceTypes } = props;

  const panelRef = useRef<any>()

  const form = useMemo(() => panelRef.current?.getForm(), [panelRef.current]);

  useEffect(() => {
    if (!form) return;
    if (values) {
      form.setFieldsValue(values);
    }
  }, [values, form]);

  const handleSpaceChange = (value) => {
    if (!form) return;
    form.setFieldsValue({
      space: value,
    });
    onChange?.(form.getFieldsValue());
  }

  const handleFilterPanelChange = () => {
    onChange?.(form.getFieldsValue());
  }

  const handleServiceTypeChange = (value) => {
    if (!form) return;
    form.setFieldsValue({
      serviceType: value,
    });
    onChange?.(form.getFieldsValue());
  }

  return (
    <div className={styles.filterPanelContent}>
      <MetricsFilterPanel
        instanceList={instanceList}
        ref={panelRef}
        onChange={handleFilterPanelChange}
        onRefresh={onRefresh}
        metrics={metrics}
        onMetricsChange={onMetricsChange}
      >
        {
          serviceTypes && (
            <Form.Item label={intl.get('service.serviceType')} name="serviceType">
              <DashboardSelect onChange={handleServiceTypeChange}>
                {serviceTypes.map(serviceType => (
                  <Option key={serviceType} value={serviceType}>
                    {serviceType}
                  </Option>
                ))}
              </DashboardSelect>
            </Form.Item>
          )
        }
        {
          spaces && (
            <Form.Item label={intl.get('service.spaces')} name="space" tooltip={intl.get("metric_description.enable_space_level_metrics_tip")}>
              <DashboardSelect onChange={handleSpaceChange}>
                <Option key="all" value="">
                  {intl.get('common.all')}
                </Option>
                {spaces.map(space => (
                  <Option key={space} value={space}>
                    {space}
                  </Option>
                ))}
              </DashboardSelect>
            </Form.Item>
          )
        } 
      </MetricsFilterPanel>
    </div>
  )
}

export default ServiceMetricsFilterPanel;