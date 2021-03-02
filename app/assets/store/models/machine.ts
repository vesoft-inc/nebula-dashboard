import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@assets/config/service';
import { CARD_STEP } from '@assets/utils/dashboard';
import { LINUX } from '@assets/utils/promQL';
import { IStatRangeItem, IStatSingleItem } from '@assets/utils/interface';


const PROMQL = LINUX;
interface IState {
  cpuUsage: IStatRangeItem[]
  diskUsageRate: IStatRangeItem[]
  memoryUsageRate: IStatRangeItem[]
  transmitFlow: IStatRangeItem[]
  receiveFlow: IStatRangeItem[]
  memorySizeStat: IStatSingleItem[]
  diskSizeStat: IStatSingleItem[]
}

export const machine = createModel({
  state: {
    cpuUsage: [] as IStatRangeItem[],
    diskUsageRate: [] as IStatRangeItem[],
    memoryUsageRate: [] as IStatRangeItem[],
    transmitFlow: [] as IStatRangeItem[],
    receiveFlow: [] as IStatRangeItem[],
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
  effects: (dispatch: any) => ({
    async asyncGetCPUUsageRateByRange (payload: {
      start: number,
      end: number,
    }) {
      const { start, end } = payload;
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL.CPU_USAGE_RATE,
        start,
        end,
        step: CARD_STEP,
      })) as any;
      let cpuUsage = [];
      if (code === 0) {
        cpuUsage = data.result;
      }
      this.update({
        cpuUsage,
      });
    },

    async asyncGetMemoryUsageRateByRange (payload: {
      start: number,
      end: number,
    }) {
      const { start, end } = payload;
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL.MEMORY_USAGE_RATE,
        start,
        end,
        step: CARD_STEP,
      })) as any;
      let memoryUsageRate = [];
      if (code === 0) {
        memoryUsageRate = data.result;
      }

      this.update({
        memoryUsageRate
      });
    },

    async asyncGetMemorySizeStat () {
      const { code, data } = (await service.execPromQL({
        query: PROMQL.MEMORY_SIZE
      })) as any;

      let memorySizeStat = [];

      if (code === 0) {
        memorySizeStat = data.result;
      }

      this.update({
        memorySizeStat
      });
    },

    async asyncGetDiskUsageRateByRange (payload: {
      start: number,
      end: number,
    }) {
      const { start, end } = payload;
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL.DISK_USAGE_RATE,
        start,
        end,
        step: CARD_STEP,
      })) as any;
      let diskUsageRate = [];
      if (code === 0) {
        diskUsageRate = data.result;
      }

      this.update({
        diskUsageRate
      });
    },

    async asyncGetDiskSizeStat () {
      const { code, data } = (await service.execPromQL({
        query: PROMQL.DISK_SIZE,
      })) as any;
      let diskSizeStat = [];
      if (code === 0) {
        diskSizeStat = data.result;
      }
      this.update({
        diskSizeStat,
      });
    },

    async asyncGetFlowByRange (payload: {
      start: number,
      end: number,
    }) {
      dispatch.machine._asyncGetReceiveFlowByRange(payload);
      dispatch.machine._asyncGetTransmitFlowByRange(payload);
    },

    async _asyncGetReceiveFlowByRange (payload: {
      start: number,
      end: number,
    }) {
      const { start, end } = payload;
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL.NETWORK_FLOW_DOWN,
        start,
        end,
        step: CARD_STEP
      })) as any;

      let receiveFlow = [];

      if (code === 0) {
        receiveFlow = data.result;
      }

      this.update({
        receiveFlow,
      });
    },

    async _asyncGetTransmitFlowByRange (payload: {
      start: number,
      end: number,
    }) {
      const { start, end } = payload;
      const { code, data } = (await service.execPromQLByRange({
        query: PROMQL.NETWORK_FLOW_UP,
        start,
        end,
        step: CARD_STEP
      })) as any;

      let transmitFlow = [];

      if (code === 0) {
        transmitFlow = data.result;
      }

      this.update({
        transmitFlow,
      });
    }
  }),
});
