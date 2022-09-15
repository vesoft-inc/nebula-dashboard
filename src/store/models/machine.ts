import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@/config/service';
import { NEED_ADD_SUM_QUERYS, getProperStep, getMetricsUniqName } from '@/utils/dashboard';
import { LINUX } from '@/utils/promQL';
import { IStatRangeItem, IStatSingleItem, MetricScene, MetricsPanelValue } from '@/utils/interface';
import { unique } from '@/utils';
import { InitMachineMetricsFilterValues } from '@/utils/metric';

const PROMQL = LINUX;
export interface IState {
  cpuStat: IStatRangeItem[];
  diskStat: IStatRangeItem[];
  memoryStat: IStatRangeItem[];
  loadStat: IStatRangeItem[];
  networkOutStat: IStatRangeItem[];
  networkInStat: IStatRangeItem[];
  networkStat: IStatRangeItem[];
  memorySizeStat: IStatSingleItem[];
  diskSizeStat: IStatSingleItem[];
  instanceList: any[];
  metricsFilterValues: MetricsPanelValue;
}

export function MachineModelWrapper(service,) {
  return createModel({
    state: {
      cpuStat: [] as IStatRangeItem[],
      diskStat: [] as IStatRangeItem[],
      memoryStat: [] as IStatRangeItem[],
      networkOutStat: [] as IStatRangeItem[],
      networkInStat: [] as IStatRangeItem[],
      networkStat: [] as IStatRangeItem[],
      loadStat: [] as IStatRangeItem[],
      memorySizeStat: [] as IStatSingleItem[],
      diskSizeStat: [] as IStatSingleItem[],
      instanceList: [],
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
        const { start, end, clusterID, metric } = payload;
        const _start = start / 1000;
        const _end = end / 1000;
        const step = getProperStep(start, end);
        const { code, data } = (await service.execPromQLByRange({
          clusterID,
          query: PROMQL(clusterID)[metric],
          start: _start,
          end: _end,
          step,
        })) as any;
        let result:any = [];
        if (code === 0) {
          if (NEED_ADD_SUM_QUERYS.includes(metric)) {
            result = (await this.asyncGetSumDataByRange({
              clusterID,
              query: PROMQL(clusterID)[metric],
              start: _start,
              end: _end,
              step,
              data: data.result,
            })) as any;
          } else {
            result = data.result;
          }
        }
        const instanceList = result.map(item => item.metric.instance).filter(instance => instance !== 'total');
        this.updateInstanceList(instanceList);
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
        this.update({
          cpuStat,
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
        this.update({
          memoryStat,
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
        this.update({
          memorySizeStat,
        });
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
        this.update({
          diskStat,
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
        this.update({
          diskSizeStat,
        });
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
        this.update({
          loadStat,
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
        switch (inOrOut) {
          case 'in':
            this.update({
              networkInStat: networkStat,
            });
            break;
          case 'out':
            this.update({
              networkOutStat: networkStat,
            });
            break;
          default:
            this.update({
              networkStat,
            });
        }
        return networkStat;
      },
  
      async asyncGetSumDataByRange(payload: {
        clusterID?: string;
        query: string;
        start: number;
        end: number;
        step: number;
        data: any[];
      }) {
        const { query, start, end, step, data, clusterID } = payload;
        const { code, data: dataStat } = (await service.execPromQLByRange({
          clusterID,
          query: `sum(${query})`,
          start,
          end,
          step,
        })) as any;
        if (code === 0 && dataStat.result.length !== 0) {
          const sumData = {
            metric: {
              instance: 'total',
              job: 'total',
            },
          } as any;
          sumData.values = dataStat.result[0].values;
          return data.concat(sumData);
        }
        return data;
      },

      updateMetricsFiltervalues(values: MetricsPanelValue) {
        this.updateMetricsFilterValues({
          metricsFilterValues: values,
        });
      }
    }),
  });
}

export const machine = MachineModelWrapper(serviceApi);