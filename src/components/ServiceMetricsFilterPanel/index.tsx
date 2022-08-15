import React, { useEffect, useMemo, useRef } from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';

import MetricsFilterPanel from '../MetricsFilterPanel';
import { DashboardSelect, Option } from '../DashboardSelect';

import styles from './index.module.less';
import { AGGREGATION_OPTIONS, TIME_INTERVAL_OPTIONS } from '@/utils/dashboard';

interface IProps {
  spaces?: string[];
  instanceList: string[];
  onChange?: (values) => void;
  values?: any;
  onRefresh?: (values: any) => void;
  metrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
}

function ServiceMetricsFilterPanel(props: IProps) {
  const { spaces, instanceList, onChange, values, onRefresh, metrics, onMetricsChange } = props;

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

  const handlePeriodChange = (value) => {
    if (!form) return;
    form.setFieldsValue({
      period: value,
    });
    onChange?.(form.getFieldsValue());
  }

  const handleMetricTypeChange = (value) => {
    if (!form) return;
    form.setFieldsValue({
      metricType: value,
    });
    onChange?.(form.getFieldsValue());
  }

  const handleFilterPanelChange = () => {
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
          spaces && (
            <Form.Item label={intl.get('service.spaces')} name="space">
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
        <Form.Item
          className="metric-period"
          label={intl.get('service.period')}
          name="period"
        >
          <DashboardSelect onChange={handlePeriodChange}>
            {TIME_INTERVAL_OPTIONS.map(value => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </DashboardSelect>
        </Form.Item>
        <Form.Item
          className="metric-type"
          label={intl.get('service.metricParams')}
          name="metricType"
        >
          <DashboardSelect onChange={handleMetricTypeChange}>
            {AGGREGATION_OPTIONS.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </DashboardSelect>
        </Form.Item>
      </MetricsFilterPanel>
    </div>
  )
}

export default ServiceMetricsFilterPanel;