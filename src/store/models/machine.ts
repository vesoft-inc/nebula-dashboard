import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@/config/service';
import { NEED_ADD_SUM_QUERYS, getProperStep, getMetricsUniqName } from '@/utils/dashboard';
import { LINUX } from '@/utils/promQL';
import { IStatRangeItem, IStatSingleItem, MetricScene, MetricsPanelValue } from '@/utils/interface';
import { isCommunityVersion, unique } from '@/utils';
import { InitMachineMetricsFilterValues } from '@/utils/metric';
import { getQueryRangeInfo } from '@/utils';

const PROMQL = LINUX;
export interface IState {
  instanceList: string[];
  metricsFilterValues: MetricsPanelValue;
}

export function MachineModelWrapper(service,) {
  return createModel({
    state: {
      instanceList: [] as string[],
      metricsFilterValues: InitMachineMetricsFilterValues,
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
      async asyncGetMetricsData(payload: {
        start: number;
        end: number;
        metric: string;
        clusterID?: string;
      }) {
        let { clusterID, metric } = payload;
        const { start, end, step } = getQueryRangeInfo(payload.start, payload.end);
        const { code, data } = (await service.execPromQLByRange({
          clusterID,
          query: PROMQL(clusterID)[metric],
          start,
          end,
          step,
        })) as any;
        let result: any = [];
        if (code === 0) {
          result = data.result;
        }
        if (isCommunityVersion()) {
          const instanceList = result.map(item => item.metric.instance).filter(instance => instance !== 'total');
          this.updateInstanceList(instanceList);
        }
        return result;
      },

      async asyncGetCPUStatByRange(payload: {
        start: number;
        end: number;
        metric: string;
        clusterID?: string;
      }) {
        let cpuStat = await this.asyncGetMetricsData({
          ...payload,
          nameObj: getMetricsUniqName(MetricScene.CPU)
        });
        return cpuStat;
      },

      async asyncGetMemoryStatByRange(payload: {
        start: number;
        end: number;
        metric: string;
        clusterID?: string;
      }) {
        let memoryStat = await this.asyncGetMetricsData({
          ...payload,
          nameObj: getMetricsUniqName(MetricScene.MEMORY)
        });
        return memoryStat;
      },

      async asyncGetMemorySizeStat(clusterID?: string) {
        const { code, data } = (await service.execPromQL({
          clusterID,
          query: PROMQL(clusterID).memory_size,
        })) as any;
        let memorySizeStat = [];
        if (code === 0) {
          memorySizeStat = data.result;
        }
        return memorySizeStat;
      },

      async asyncGetDiskStatByRange(payload: {
        start: number;
        end: number;
        metric: string;
        clusterID: string;
      }) {
        let diskStat = await this.asyncGetMetricsData({
          ...payload,
          nameObj: getMetricsUniqName(MetricScene.DISK)
        });
        return diskStat;
      },

      async asyncGetDiskSizeStat(clusterID?: string) {
        const { code, data } = await service.execPromQL({
          clusterID,
          query: PROMQL(clusterID).disk_size,
        });
        let diskSizeStat = [];
        if (code === 0) {
          diskSizeStat = data.result;
        }
        return diskSizeStat;
      },

      async asyncGetLoadByRange(payload: {
        start: number;
        end: number;
        metric: string;
        clusterID: string;
      }) {
        let loadStat = await this.asyncGetMetricsData({
          ...payload,
          nameObj: getMetricsUniqName(MetricScene.LOAD)
        });
        return loadStat;
      },

      async asyncGetNetworkStatByRange(payload: {
        start: number;
        end: number;
        metric: string;
        inOrOut?: string;
        clusterID?: string;
      }) {
        const { start, end, metric, clusterID, inOrOut } = payload;
        let networkStat = await this.asyncGetMetricsData({ start, end, metric, clusterID, nameObj: getMetricsUniqName(MetricScene.NETWORK) });
        return networkStat;
      },

      updateMetricsFiltervalues(values: MetricsPanelValue) {
        this.updateMetricsFilterValues({
          metricsFilterValues: {
            ...values,
          },
        });
      }
    }),
  });
}

export const machine = MachineModelWrapper(serviceApi);