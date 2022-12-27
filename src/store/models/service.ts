import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@/config/service';
import { IPanelConfig, ServiceMetricsPanelValue } from '@/utils/interface';
import { DEFAULT_SERVICE_PANEL_CONFIG } from '@/utils/service';
import { getProperStep } from '@/utils/dashboard';
import { unique } from '@/utils';
import { getClusterPrefix } from '@/utils/promQL';
import { InitMetricsFilterValues } from '@/utils/metric';

interface IState {
  panelConfig: IPanelConfig;
  instanceList: string[];
  metricsFilterValues: ServiceMetricsPanelValue;
}

export function SereviceModelWrapper(serviceApi) {
  return createModel({
    state: {
      // panelConfig: localStorage.getItem('panelConfig')
      //   ? JSON.parse(localStorage.getItem('panelConfig')!)
      //   : DEFAULT_SERVICE_PANEL_CONFIG,
      panelConfig: DEFAULT_SERVICE_PANEL_CONFIG,
      instanceList: [],
      metricsFilterValues: InitMetricsFilterValues
    },
    reducers: {
      update: (state: IState, payload: any) => ({
        ...state,
        ...payload,
      }),
      updateInstanceList: (state: IState, payload: any) => {
        const instanceList = unique(state.instanceList.concat(payload));
        return { ...state, instanceList };
      },
      updateMetricsFilterValues: (state: IState, payload: any) => {
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
      async asyncGetMetricsSumData(payload: {
        query: string;
        start: number;
        end: number;
        space?: string;
        clusterID?: string;
      }) {
        const { start, end, space, query: _query, clusterID } = payload;
        const step = getProperStep(start, end);
        let _start = start / 1000;
        let _end = end / 1000;
        _start = _start - _start % step;
        _end = _end + (step - _end % step);
        let query = `sum(${_query}{${getClusterPrefix()}="${clusterID}"})`;
        query = `${_query}{${getClusterPrefix()}="${clusterID}", space="${space || ''}"}`;
        const { code, data } = (await serviceApi.execPromQLByRange({
          clusterID,
          query,
          start: _start,
          end: _end,
          step,
        })) as any;

        if (code === 0 && data.result.length !== 0) {
          const sumData = {
            metric: {
              instanceName: 'total',
              instance: 'total',
            },
          } as any;
          sumData.values = data.result[0].values;
          return sumData;
        }
        return [];
      },

      async asyncGetMetricsData(payload: {
        query: string;
        space?: string;
        start: number;
        end: number;
        clusterID?: string;
        noSuffix?: boolean;
        isRawMetric?: boolean;
      }) {
        const {
          start,
          space,
          end,
          query: _query,
          clusterID,
          noSuffix = false,
        } = payload;
        const step = getProperStep(start, end);
        let _start = start / 1000;
        let _end = end / 1000;
        _start = _start - _start % step;
        _end = _end + (step - _end % step);
        let query = _query;
        if (!noSuffix) {
          if (clusterID) {
            if (!payload.isRawMetric) {
              query = `sum_over_time(${_query}{${getClusterPrefix()}="${clusterID}", space="${space || ''}"}[${step}s])`;
            } else {
              query = `${_query}{${getClusterPrefix()}="${clusterID}", space="${space || ''}"}`;
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
        const list = stat.map(item => {
          const instanceName = item.metric.instanceName || item.metric.instance;
          return instanceName.slice(0, instanceName.indexOf('-'))
        });
        this.updateInstanceList(list)
        return stat;
      },

      async asyncGetStatus(payload: {
        interval: number;
        end: number;
        query: string;
        clusterID?: string;
      }) {
        const { interval, end, query, clusterID } = payload;
        const start = end - interval;
        const step = getProperStep(start, end);
        const _start = start / 1000;
        const _end = end / 1000;
        const { code, data } = (await serviceApi.execPromQLByRange({
          clusterID,
          query: clusterID ? `${query}{${getClusterPrefix()}="${clusterID}"}` : query,
          start: _start,
          end: _end,
          step,
        })) as any;
        let normal = 0;
        let abnormal = 0;
        if (code === 0) {
          data.result.forEach(item => {
            const value = item.values.pop();
            if (value[1] === '1') {
              normal++;
            } else {
              abnormal++;
            }
          });
        }
        return {
          normal,
          abnormal,
        };
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