import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@assets/config/service';
import { CARD_STEP } from '@assets/utils/dashboard';

export interface IStatItem {
  metric: { instance: string },
  values: [number, any][]
}

interface IStatSingleItem {
  metric: { instance: string },
  value: [number, any]
}

interface IState {
  cpuUsage: IStatItem[]
  diskUsageRate: IStatItem[]
  memoryUsageRate: IStatItem[]
  transmitFlow: IStatItem[]
  receiveFlow: IStatItem[]
  memorySizeStat: IStatSingleItem[]
  diskSizeStat: IStatSingleItem[]
}

export const machine = createModel({
  state: {
    cpuUsage: [] as IStatItem[],
    diskUsageRate: [] as IStatItem[],
    memoryUsageRate: [] as IStatItem[],
    transmitFlow: [] as IStatItem[],
    receiveFlow: [] as IStatItem[],
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
      const promQL = `round((1-(sum(increase(node_cpu_seconds_total{mode="idle"}[1m]))by(instance)) / (sum(increase(node_cpu_seconds_total[1m]))by(instance)))*100)`;
      const { code, data } = (await service.execPromQLByRange({
        query: promQL,
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
      const promQL = '(1 - avg_over_time(node_memory_free_bytes[1m]) / avg_over_time(node_memory_total_bytes[1m]) )* 100';
      const { code, data } = (await service.execPromQLByRange({
        query: promQL,
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
      const promQL = 'node_memory_total_bytes';
      const { code, data } = (await service.execPromQL({
        query: promQL
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
      const promQL = '(1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} ) /  node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})* 100';
      const { code, data } = (await service.execPromQLByRange({
        query: promQL,
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
      const promQL = 'node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}';
      const { code, data } = (await service.execPromQL({
        query: promQL,
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
      const promQL = 'sum by(instance)(rate(node_network_receive_bytes_total{device=~"en[0-9]*"}[1m]))';
      const { code, data } = (await service.execPromQLByRange({
        query: promQL,
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
      const promQL = 'sum by(instance)(rate(node_network_transmit_bytes_total{device=~"en[0-9]*"}[1m]))';
      const { code, data } = (await service.execPromQLByRange({
        query: promQL,
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
