import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@assets/config/service';

interface IState {

}

export const machine = createModel({
  state: {
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async asyncGetCPUUsageRate () {
      const promQL = '(1-(sum(increase(node_cpu_seconds_total{mode="idle"}[1m]))by(instance)) / (sum(increase(node_cpu_seconds_total[1m]))by(instance)))*100';
      const { code, data } = (await service.execPromQL({
        query: promQL,
      })) as any;
      if (code === 0) {
        console.log(data, '<<<<<<<<<<<<');
      }
    },

    async asyncGetMemoryUsageRate () {
      const promQL = '(1 - avg_over_time(node_memory_free_bytes[1m]) / avg_over_time(node_memory_total_bytes[1m]) )* 100';
      const { code, data } = (await service.execPromQL({
        query: promQL,
      })) as any;
      if (code === 0) {
        console.log(data, '<<<<<<<<<<<<');
      }
    },

    async asyncGetDiskUsageRate () {
      const promQL = '(1 - (node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} ) /  node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})* 100';
      const { code, data } = (await service.execPromQL({
        query: promQL,
      })) as any;
      if (code === 0) {
        console.log(data, '<<<<<<<<<<<<');
      }
    },
  },
});
