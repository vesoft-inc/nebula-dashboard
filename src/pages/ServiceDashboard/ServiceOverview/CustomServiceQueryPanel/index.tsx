import React, { useEffect, useState, useMemo } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import Icon from '@/components/Icon';
import { IServiceMetricItem, IServicePanelConfig, MetricScene, ServiceName } from '@/utils/interface';
import { AggregationType, calcTimeRange, getDataByType, getMetricsUniqName, TIME_OPTION_TYPE } from '@/utils/dashboard';
import Card from '@/components/Service/ServiceCard/Card';
import { IDispatch, IRootState } from '@/store';
import { shouldCheckCluster } from '@/utils';
import classnames from "classnames";

import './index.less';
import { getQueryByMetricType } from '@/utils/metric';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetMetricsData: dispatch.service.asyncGetMetricsData as any,
});

const mapState = (state: IRootState) => ({
  aliasConfig: state.app.aliasConfig,
  cluster: (state as any).cluster?.cluster,
  metricsFilterValues: state.service.metricsFilterValues,
  serviceMetric: state.serviceMetric,
  instances: state.service.instanceList,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  onConfigPanel: () => void;
  serviceType: ServiceName;
  config: IServicePanelConfig;
  isHidePeriod?: boolean;
}

function CustomServiceQueryPanel(props: IProps) {

  const { config, cluster, asyncGetMetricsData, onConfigPanel, aliasConfig, metricsFilterValues, isHidePeriod, serviceMetric, serviceType, instances } = props;

  const [data, setData] = useState<any[]>([])

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
  }, [metricsFilterValues,  cluster, config, serviceMetric])

  const getMetricsData = async () => {
    let { period: metricPeriod = 5, space, metric } = config;
    const {timeRange} = metricsFilterValues
    const [start, end] = calcTimeRange(timeRange);
    const item = (serviceMetric[serviceType] as IServiceMetricItem[]).find((metricItem: IServiceMetricItem) => metricItem.metric === metric);
    const aggregation = item?.aggregations[0] as AggregationType;
    if (item) {
      const data = await asyncGetMetricsData({
        query: getQueryByMetricType(item, aggregation, metricPeriod?.toString()), // EXPLAIN: query like nebula_graphd_num_queries_rate_600
        start,
        end,
        space,
        clusterID: cluster?.id,
        isRawMetric: item.isRawMetric,
        aggregation
      });
      setData(data)
    }
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
          <div
            className={classnames('blue btn-icon-with-desc', {
              'hide-period': isHidePeriod,
            })}
            onClick={onConfigPanel}
          >
            <Icon icon="#iconSet_up" />
            <span>{intl.get('common.set')}</span>
          </div>
        </div>
      </div>
      <div className="content">
        <Card
            baseLine={config.baseLine}
            data={getDataByType({
              data,
              type: metricsFilterValues.instanceList,
              nameObj: getMetricsUniqName(MetricScene.SERVICE),
              aliasConfig,
              instanceList: instances
            })}
            serviceType={serviceType}
            loading={false}
          />
      </div>
    </div>
  );
}

export default connect(mapState, mapDispatch)(CustomServiceQueryPanel);
