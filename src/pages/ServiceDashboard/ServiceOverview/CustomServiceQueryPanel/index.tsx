import React, { useEffect, useState, useMemo } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import Icon from '@/components/Icon';
import { IServicePanelConfig } from '@/utils/interface';
import { calcTimeRange, getDataByType } from '@/utils/dashboard';
// import {
//   SERVICE_DEFAULT_RANGE,
// } from '@/utils/service';
import Card from '@/components/Service/ServiceCard/Card';
import { IDispatch, IRootState } from '@/store';
import { isEnterpriseVersion, shouldCheckCluster } from '@/utils';

import './index.less';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetMetricsData: dispatch.service.asyncGetMetricsData as any,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  cluster: (state as any).cluster?.cluster,
  metricsFilterValues: state.service.metricsFilterValues,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  onConfigPanel: () => void;
  config: IServicePanelConfig;
  aliasConfig: any;
}

function CustomServiceQueryPanel(props: IProps) {

  const { config, cluster, asyncGetMetricsData, onConfigPanel, aliasConfig, metricsFilterValues } = props;

  const [ data, setData ] = useState<any[]>([])

  let pollingTimer: any = useMemo(() => undefined, []);

  useEffect(() => {
    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }
    if (shouldCheckCluster()) {
      if (cluster.id) {
        pollingData();
      }
    } else {
      pollingData();
    }
    return () => {
      if (pollingTimer) {
        clearTimeout(pollingTimer);
      }
    }
  }, [metricsFilterValues.timeRange, , metricsFilterValues.frequency, cluster, config])

  const getMetricsData = async () => {
    const { period: metricPeriod, metricFunction, space } = config;
    const [ start, end ] = calcTimeRange(metricsFilterValues.timeRange);
    const data = await asyncGetMetricsData({
      query: metricFunction + metricPeriod, // EXPLAIN: query like nebula_graphd_num_queries_rate_600
      start,
      end,
      space,
      clusterID: cluster?.id
    });
    setData(data)
  };

  const pollingData = () => {
    getMetricsData();
    if (metricsFilterValues.frequency > 0) {
      pollingTimer = setTimeout(() => {
        pollingData();
      }, metricsFilterValues.frequency);
    }
  };

  return (
    <div className="service-card">
      <div className="header">
        <Popover
          placement="bottomLeft"
          content={intl.get(`metric_description.${config.metric}`)}
        >
          {config.metric}
        </Popover>
        <div>
          <span>
            {intl.get('service.period')}: <span>{config.period}</span>
          </span>
          <span>
            {intl.get('service.metricParams')}: <span>{config.metricType}</span>
          </span>
          <div
            className="btn-icon-with-desc blue"
            onClick={onConfigPanel}
          >
            <Icon icon="#iconSetup" />
            <span>{intl.get('common.set')}</span>
          </div>
        </div>
      </div>
      <div className="content">
        {data.length > 0 && (
          <Card
            baseLine={config.baseLine}
            data={getDataByType({
              data,
              type: metricsFilterValues.instanceList,
              name: 'instanceName',
              aliasConfig,
            })}
            loading={false}
          />
        )}
      </div>
    </div>
  );
}

export default connect(mapState, mapDispatch)(CustomServiceQueryPanel);
