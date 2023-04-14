import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import intl from 'react-intl-universal';

import DashboardCard from '@/components/DashboardCard';
import MetricCard from '@/components/MetricCard';
import TimeSelect from '@/components/TimeSelect';

import styles from './index.module.less';
import FrequencySelect from '@/components/MetricsFilterPanel/FrequencySelect';
import { getMachineMetricData } from '@/utils/promQL';
import { TIME_OPTION_TYPE } from '@/utils/dashboard';
import DiskCard from '../Cards/DiskCard';

const mapState = (state: any) => ({
  cluster: state.cluster.cluster,
});

interface IProps extends ReturnType<typeof mapState> {

}

function MachinePanelDetail(props: IProps) {
  const { cluster } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { instance, panelKey } = useParams<{
    instance: string;
    panelKey: string;
  }>();
  const [panelInfo, setPanelInfo] = useState<any>();

  const [timeRange, setTimeRange] = useState<
    TIME_OPTION_TYPE | [number, number]
  >(TIME_OPTION_TYPE.HOUR1);

  const curInstance = useMemo(() => instance.replaceAll('_', '.'), [instance]);

  const cardObj = useMemo(() => getMachineMetricData(curInstance, cluster), [curInstance, cluster]);
  const diskCardRef = useRef<any>();
  const metricRef = useRef<any>();
  const [frequencyValue, setFrequencyValue] = useState<number>(0);
  const pollingTimerRef = useRef<any>(null);

  useEffect(() => {
    if (panelKey) {
      setPanelInfo(cardObj[panelKey])
    }
  }, [panelKey, cardObj])

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearPolling();
    }
    if (frequencyValue > 0) {
      pollingData();
    }
  }, [frequencyValue]);

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };

  const handleTimeSelectChange = (
    value: TIME_OPTION_TYPE | [number, number],
  ) => {
    setTimeRange(value);
  };

  const pollingData = () => {
    fetchMonitorData(false);
    if (frequencyValue > 0) {
      pollingTimerRef.current = setInterval(() => {
        fetchMonitorData(false);
      }, frequencyValue);
    }
  };

  useEffect(() => {
    fetchMonitorData(true);
  }, [panelInfo, timeRange]);

  const fetchMonitorData = (shouldLoading: boolean) => {
    shouldLoading && setLoading(true);
    if (panelKey === 'disk') {
      diskCardRef.current?.handleRefresh?.().then(() => {
        shouldLoading && setLoading(false);
      });
    } else {
      metricRef.current?.handleRefresh?.().then(() => {
        shouldLoading && setLoading(false);
      });
    }
  };

  const renderDetailContent = () => {
    if (panelKey === 'disk') {
      return (
        <DashboardCard title={`${intl.get('device.disk')}(${curInstance})`}>
          <DiskCard ref={diskCardRef} cluster={cluster} instance={curInstance} />
        </DashboardCard>
      );
    }
    if (panelInfo) {
      return (
        <DashboardCard title={`${panelInfo.title}(${curInstance})`}>
          <MetricCard
            ref={metricRef}
            valueType={panelInfo.valueType}
            queries={panelInfo.queries}
            timeRange={timeRange}
          />
        </DashboardCard>
      )
    }
  }

  const handleFrequencyChange = (value: number) => {
    setFrequencyValue(value);
  };

  const handleRefresh = () => {
    fetchMonitorData(true);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.dashboardDetail}>
        {
          panelKey != 'disk' && (
            <div className={styles.commonHeader}>
              <TimeSelect value={timeRange} onChange={handleTimeSelectChange} />
              <div style={{ marginLeft: 14 }}>
                <FrequencySelect
                  handleRefresh={handleRefresh}
                  onChange={handleFrequencyChange}
                  value={frequencyValue}
                />
              </div>
            </div>
          )
        }
        <div className={styles.detailContent}>
          {renderDetailContent()}
        </div>
      </div>
    </Spin>
  )
}

export default connect(mapState)(MachinePanelDetail);