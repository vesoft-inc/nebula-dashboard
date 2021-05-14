import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@assets/config/service';
import { getProperStep } from '@assets/utils/dashboard';
import { LINUX } from '@assets/utils/promQL';
import { IStatRangeItem, IStatSingleItem } from '@assets/utils/interface';


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
    diskSizeStat: [] as IStatSingleItem[],
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
    async asyncGetCPUStatByRange (payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = Math.round(start / 1000);
      const _end = Math.round(end / 1000);
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let cpuStat = [];
      if (code === 0) {
        cpuStat = data.result;
      }
      this.update({
        cpuStat,
      });
    },

    async asyncGetMemoryStatByRange (payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = Math.round(start / 1000);
      const _end = Math.round(end / 1000);
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let memoryStat = [];
      if (code === 0) {
        memoryStat = data.result;
      }

      this.update({
        memoryStat
      });
    },

    async asyncGetMemorySizeStat () {
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

    async asyncGetDiskStatByRange (payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = Math.round(start / 1000);
      const _end = Math.round(end / 1000);
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;
      let diskStat = [];
      if (code === 0) {
        diskStat = data.result;
      }

      this.update({
        diskStat
      });
    },

    async asyncGetDiskSizeStat () {
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

    async asyncGetLoadByRange (payload: {
      start: number,
      end: number,
      metric: string,
    }) {
      const { start, end, metric } = payload;
      const _start = Math.round(start / 1000);
      const _end = Math.round(end / 1000);
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;

      let loadStat = [];
      if (code === 0) {
        loadStat = data.result;
      }
      this.update({
        loadStat,
      });
    },

    async asyncGetNetworkStatByRange (payload: {
      start: number,
      end: number,
      metric: string,
      inOrOut?: string,
    }) {
      const { start, end, metric, inOrOut } = payload;
      const _start = Math.round(start / 1000);
      const _end = Math.round(end / 1000);
      const step = getProperStep(start, end);
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL[metric],
        start: _start,
        end: _end,
        step,
      })) as any;

      let networkStat = [];

      if (code === 0) {
        networkStat = data.result;
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
    }
  }),
});
