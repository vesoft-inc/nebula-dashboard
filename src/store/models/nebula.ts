import { createModel } from '@rematch/core';
import _ from 'lodash';
import cookies from 'js-cookie';
import service from '@/config/service';
import { getConfigData } from "@/utils/dashboard";

interface IState {
  configs: any[];
  jobs: any[];
  spaces: string[];
  parts: any[];
  services: any[];
  currentSpace: string;
  version: string;
}

type IServiceType = 'GRAPH' | 'STORAGE' | 'META';

export const nebula = createModel({
  state: {
    configs: [],
    jobs: [],
    spaces: [] as any,
    parts: [],
    services: [],
    currentSpace: '',
    version: cookies.get('version') || '',
  },
  reducers: {
    update: (state: IState, payload: any) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch: any) => ({
    async asyncGetServiceConfigs(module) {
      const data = module === 'graph'?await service.getGraphConfig(): await service.getStorageConfig() as any;

      if (data) {
        this.update({
          configs: getConfigData(data),
        });
      }
    },

    async asyncGetJobs() {
      const { code, data } = (await service.execNGQL({
        gql: 'SHOW JOBS',
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          jobs: data.tables,
        });
      }
    },

    async asyncGetSpaces() {
      const { code, data } = (await service.execNGQL({
        gql: 'SHOW SPACES',
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          spaces: data.tables ? data.tables : [],
        });
      }
    },

    async asyncUseSpaces(space) {
      const { code, data } = (await service.execNGQL({
        gql: `USE ${space}`,
      })) as any;
      return { code, data };
    },

    async asyncGetParts(partId?: string) {
      const { code, data } = (await service.execNGQL({
        gql: partId ? `SHOW PARTS ${partId}` : 'SHOW PARTS',
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          parts: data.tables,
        });
      }
      return data.tables;
    },

    async asyncGetServices() {
      const hostData = await dispatch.nebula.asyncGetHostsInfo();
      let data = [];
      if (hostData.length > 0) {
        const storageData = await dispatch.nebula.asyncGetHostsInfo('STORAGE');
        data = hostData.map(host => {
          const storage = storageData.find(
            storage => storage.Host === host.Host,
          );
          return {
            ...host,
            ...storage,
          };
        });
      }
      this.update({
        services: data,
      });
    },

    async asyncGetHostsInfo(type?: IServiceType) {
      const res = (await service.execNGQL({
        gql: `SHOW HOSTS ${type || ''}`,
      })) as any;
      let data = [];
      if (res.code === 0 && res.data.tables) {
        data = res.data.tables;
      }
      return data;
    },

    async asyncGetServiceVersion(type?: IServiceType) {
      // HACK: user git info instead of version
      const res = await dispatch.nebula.asyncGetHostsInfo(type);
      return res.map(item => ({
        name: `${item.Host}:${item.Port}`,
        version: item['Version'],
      }));
    },
  }),
});
