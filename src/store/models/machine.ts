import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@/config/service';
import { NEED_ADD_SUM_QUERYS, getProperStep } from '@/utils/dashboard';
import { LINUX } from '@/utils/promQL';
import { IStatRangeItem, IStatSingleItem } from '@/utils/interface';


const PROMQL = LINUX;
interface IState {
  cpuStat: IStatRangeItem[]
  diskStat: IStatRangeItem[]
  memoryStat: IStatRangeItem[]
  loadStat: IStatRangeItem[]
  networkOutStat: IStatRangeItem[]
  networkInStat: IStatRangeItem[]
  networkStat: IStatRangeItem[]
  memorySizeStat: IStatSingleItem[]
  diskSizeStat: IStatSingleItem[]
}

export const machine = createModel({
  state: {
    cpuStat: [] as IStatRangeItem[],
    diskStat: [] as IStatRangeItem[],
    memoryStat: [] as IStatRangeItem[],
    networkOutStat: [] as IStatRangeItem[],
    networkInStat: [] as IStatRangeItem[],
    networkStat: [] as IStatRangeItem[],
    loadStat: [] as IStatRangeItem[],
    memorySizeStat: [] as IStatSingleItem[],
    diskSizeStat: [] as IStatSingleItem[]
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
    async asyncGetCPUStatByRange(payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = start / 1000;
      const _end = end / 1000;
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let cpuStat = [];
      if (code === 0) {
        if(NEED_ADD_SUM_QUERYS.includes(metric)){
          cpuStat = await this.asyncGetSumDataByRange({
            query: PROMQL[metric],
            start: _start,
            end: _end,
            step,
            data:data.result,
          }) as any;
        }else{
          cpuStat = data.result;
        }
      }
      this.update({
        cpuStat,
      });
    },

    async asyncGetMemoryStatByRange(payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = start / 1000;
      const _end = end / 1000;
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let memoryStat = [];
      
      if (code === 0) {
        if(NEED_ADD_SUM_QUERYS.includes(metric)){
          memoryStat = await this.asyncGetSumDataByRange({
            query: PROMQL[metric],
            start: _start,
            end: _end,
            step,
            data:data.result,
          }) as any;
        }else{
          memoryStat = data.result;
        }
      }

      this.update({
        memoryStat
      });
    },

    async asyncGetMemorySizeStat() {
      const { code, data } = (await service.execPromQL({
        query: PROMQL.memory_size
      })) as any;

      let memorySizeStat = [];

      if (code === 0) {
        memorySizeStat = data.result;
      }

      this.update({
        memorySizeStat
      });
    },

    async asyncGetDiskStatByRange(payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = start / 1000;
      const _end = end / 1000;
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let diskStat = [] as any;
      if (code === 0) {
        if(NEED_ADD_SUM_QUERYS.includes(metric)){
          diskStat = await this.asyncGetSumDataByRange({
            query: PROMQL[metric],
            start: _start,
            end: _end,
            step,
            data: data.result,
          }) as any;
        }else{
          diskStat = data.result;
        }
        diskStat = diskStat.map((stat:any) => {
          if(stat.metric.device){
            return{
              values: stat.values,
              metric:{
                ...stat.metric,
                instance: `${stat.metric.instance}  (${stat.metric.device})`
              }
            };
          }else{
            return stat;
          }
        });
      }

      this.update({
        diskStat
      });
    },

    async asyncGetDiskSizeStat() {
      const { code, data } = (await service.execPromQL({
        query: PROMQL.disk_size,
      })) as any;
      let diskSizeStat = [];
      if (code === 0) {
        diskSizeStat = data.result;
      }
      this.update({
        diskSizeStat,
      });
    },

    async asyncGetLoadByRange(payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = start / 1000;
      const _end = end / 1000;
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;

      let loadStat = [];
      if (code === 0) {
        if(NEED_ADD_SUM_QUERYS.includes(metric)){
          loadStat = await this.asyncGetSumDataByRange({
            query: PROMQL[metric],
            start: _start,
            end: _end,
            step,
            data:data.result,
          }) as any;
        }else{
          loadStat = data.result;
        }
      }
      this.update({
        loadStat,
      });
    },

    async asyncGetNetworkStatByRange(payload: {
      start: number,
      end: number,
      metric: string,
      inOrOut?: string,
    }) {
      const { start, end, metric, inOrOut } = payload;
      const _start = start / 1000;
      const _end = end / 1000;
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;

      let networkStat = [];

      if (code === 0) {
        if(NEED_ADD_SUM_QUERYS.includes(metric)){
          networkStat = await this.asyncGetSumDataByRange({
            query: PROMQL[metric],
            start: _start,
            end: _end,
            step,
            data:data.result,
          }) as any;
        }else{
          networkStat = data.result;
        }
      }

      switch(inOrOut) {
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
    },

    async  asyncGetSumDataByRange(payload: {
      query: string,
      start: number,
      end: number,
      step: number,
      data: any[],
    }) {
      const { query, start, end, step, data } = payload;
      const { code, data:dataStat } = (await service.execPromQLByRange({
        query: `sum(${query})`,
        start,
        end,
        step,
      })) as any;
      if(code === 0 && dataStat.result.length !== 0){
        const sumData = {
          metric:{
            instance: 'total',
            job: 'total'
          },
        } as any;
        sumData.values = dataStat.result[0].values;
        return data.concat(sumData);
      }else{
        return data;
      }
    },
  }),
});
