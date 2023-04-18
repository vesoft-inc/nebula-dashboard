import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@/config/service';
import { IPanelConfig, ServiceMetricsPanelValue } from '@/utils/interface';
import { DEFAULT_SERVICE_PANEL_CONFIG } from '@/utils/service';
import { AggregationType } from '@/utils/dashboard';
import { isCommunityVersion, unique } from '@/utils';
import { getClusterPrefix } from '@/utils/promQL';
import { InitMetricsFilterValues } from '@/utils/metric';
import { getQueryRangeInfo } from '@/utils';

interface IServiceState {
  panelConfig: IPanelConfig;
  instanceList: string[];
  metricsFilterValues: ServiceMetricsPanelValue;
}

export function SereviceModelWrapper(serviceApi) {
  return createModel({
    state: {
      panelConfig: DEFAULT_SERVICE_PANEL_CONFIG,
      instanceList: [],
      metricsFilterValues: InitMetricsFilterValues
    },
    reducers: {
      update: (state: IServiceState, payload: any) => ({
        ...state,
        ...payload,
      }),
      updateInstanceList: (state: IServiceState, payload: any) => {
        const instanceList = unique(state.instanceList.concat(payload));
        return { ...state, instanceList };
      },
      updateMetricsFilterValues: (state: IServiceState, payload: any) => {
        const metricsFilterValues = {
          ...state.metricsFilterValues,
          ...payload.metricsFilterValues
        }
        return {
          ...state,
          metricsFilterValues
        }
      }
    },
    effects: () => ({
      async asyncGetMetricsData(payload: {
        query: string;
        space?: string;
        start: number;
        end: number;
        clusterID?: string;
        noSuffix?: boolean;
        isRawMetric?: boolean;
        aggregation: AggregationType;
      }) {
        const {
          start,
          space,
          end,
          query: _query,
          clusterID,
          noSuffix = false,
        } = payload;
        const { start: _start, end: _end, step } = getQueryRangeInfo(start, end);
        let query = _query;
        if (!noSuffix) {
          if (clusterID) {
            if (!payload.isRawMetric && payload.aggregation === AggregationType.Sum) {
              query = `sum_over_time(${_query}{${getClusterPrefix()}="${clusterID}", space="${space || ''}"}[${step}s])`;
            } else {
              if (query.includes('cpu_seconds_total')) {
                query = `avg by (instanceName) (rate(${query}{${getClusterPrefix()}="${clusterID}"}[5m])) * 100`
              } else {
                query = `${_query}{${getClusterPrefix()}="${clusterID}", space="${space || ''}"}`;
              }
            }
          } else {
            query = `${_query}{space="${space || ''}"}`;
          }
        }
        const { code, data } = (await serviceApi.execPromQLByRange({
          clusterID,
          query,
          start: _start,
          end: _end,
          step,
        })) as any;
        let stat = [] as any;
        if (code === 0 && data.result.length !== 0) {
          stat = data.result;
        }
        if (isCommunityVersion()) {
          const list = stat.map(item => {
            const instanceName = item.metric.instanceName || item.metric.instance;
            return instanceName.slice(0, instanceName.indexOf('-'))
          });
          this.updateInstanceList(list)
        }
        return stat;
      },
      updateMetricsFiltervalues(values: ServiceMetricsPanelValue) {
        this.updateMetricsFilterValues({
          metricsFilterValues: values,
        });
      }
    }),
  });
}

export const service = SereviceModelWrapper(serviceApi);