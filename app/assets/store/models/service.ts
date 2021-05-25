import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@assets/config/service';
import { IServicePanelConfig } from '@assets/utils/interface';
import { DEFAULT_SERVICE_PANEL_CONFIG, getQPSData } from '@assets/utils/service';
import { SERVICE_SUPPORT_METRICS } from '@assets/utils/promQL';
import { getProperStep } from '@assets/utils/dashboard';


interface IState {
  servicePanelConfig: {
    graph: IServicePanelConfig[],
    storage: IServicePanelConfig[],
    meta: IServicePanelConfig[],
  }
}

export const service = createModel({
  state: {
    servicePanelConfig: localStorage.getItem('servicePanelConfig') ? JSON.parse(localStorage.getItem('servicePanelConfig')!) : DEFAULT_SERVICE_PANEL_CONFIG,
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: () => ({
    async asyncGetMetricsData (payload: {
      query:string,
      metric: string,
      start: number,
      end: number,
      timeInterval: number,
    }) {
      const { start, end, query, metric, timeInterval } = payload;
      const step = getProperStep(start, end);
      const _start = start / 1000;
      const _end = end / 1000;
      const { code, data } = (await serviceApi.execPromQLByRange({
        query,
        start: _start,
        end: _end,
        step,
      })) as any;
      let stat = [] as any;
      if (code === 0) {
        if(metric === SERVICE_SUPPORT_METRICS.graph[0].metric || metric===SERVICE_SUPPORT_METRICS.graph[1].metric){
          stat = getQPSData(data, timeInterval);
        }else{
          stat = data.result;
        }
      }
      return stat;
    },

    async asyncGetStatus (payload: {
      interval: number,
      end: number,
      query: string,
    }) {
      const { interval, end, query } = payload;
      const start = end - interval;
      const step = getProperStep(start, end);
      const _start = start / 1000;
      const _end = end / 1000;
      const { code, data } = (await serviceApi.execPromQLByRange({
        query,
        start: _start,
        end: _end,
        step,
      })) as any;
      let normal = 0;
      let abnormal = 0;
      if(code === 0){
        data.result.forEach(item => {
          const value = item.values.pop();
          if(value[1] === '1'){
            normal++;
          }else{
            abnormal++;
          }
        });
      }
      return {
        normal,
        abnormal
      };
    },
  }),
});
