import { createModel } from '@rematch/core';
import _ from 'lodash';
import service from '@/config/service';
import { getVersion } from "@/utils/dashboard";
import { NebulaVersionType, ServiceName } from '@/utils/interface';
import { SessionStorageUtil } from '@/utils';

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

export function NebulaModelWrapper(serviceApi, state, _effects) {
  return createModel({
    state: {
      jobs: [],
      spaces: [] as any,
      parts: [],
      services: [],
      currentSpace: undefined,
      ...state,
    },
    reducers: {
      update: (state: IState, payload: any) => ({
        ...state,
        ...payload,
      }),
    },
    effects: (dispatch: any) => ({
      async getJobs() {
          const { code, data } = (await serviceApi.execNGQL({
          gql: 'show jobs',
        })) as any; 
        return { code,data };
      },
      async asyncGetServiceConfigs(module: ServiceName) {
        const data = await serviceApi.getConfigInfo(module)() ;
        return data;
      },
      async asyncGetJobs() {
        const { code, data } = (await serviceApi.execNGQL({
          gql: 'SHOW JOBS',
        })) as any;
        if (code === 0 && data.tables) {
          this.update({
            jobs: data.tables,
          });
          return data.tables;
        }
      },

      async asyncGetNebulaVersion() {
        const res: any = await this.asyncGetServiceVersion('GRAPH');
        if (res.length) {
          const version = getVersion(res[0].version);
          this.update({
            version,
          });
        }
      },

      async asyncGetSpaces() {
        const { code, data } = (await serviceApi.execNGQL({
          gql: 'SHOW SPACES',
        })) as any;
        if (code === 0 && data.tables) {
          this.update({
            spaces: data.tables ? data.tables : [],
          });
        }
        return { code };
      },

      async asyncUseSpaces(space) {
        const { code, data } = (await serviceApi.execNGQL({
          gql: `USE \`${space}\``,
        })) as any;
        if (code === 0) {
          (this as any).update({
            currentSpace: space,
          });
          SessionStorageUtil.setItem('currentSpace', space);
        }
        return { code, data };
      },

      async asyncGetParts(partId?: string) {
        const { code, data } = (await serviceApi.execNGQL({
          gql: partId ? `SHOW PARTS ${partId}` : 'SHOW PARTS',
        })) as any;
        if (code === 0 && data.tables) {
          this.update({
            parts: data.tables,
          });
          return data.tables;
        }
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
        const res = (await serviceApi.execNGQL({
          gql: `SHOW HOSTS ${type || ''}`,
        })) as any;
        let data = [];
        if (res.code === 0 && res.data.tables) {
          data = res.data.tables;
        }
        return data;
      },

      async asyncExecNGQL(gql) {
        const res = (await serviceApi.execNGQL({ gql })) as any;
        return res.code;
      },

      async asyncGetServiceVersion(type?: IServiceType) {
        // HACK: user git info instead of version
        const res = await dispatch.nebula.asyncGetHostsInfo(type);
        const versionInfos = res.map(item => ({
          name: `${item.Host}:${item.Port}`,
          version: item.Version || item['Git Info Sha'],
          type: (item.Version || item['Git Info Sha']).includes('ent')
            ? NebulaVersionType.ENTERPRISE
            : NebulaVersionType.COMMUNITY,
        }));
        return versionInfos;
      },

      clear() {
        this.update({
          configs: [],
          jobs: [],
          spaces: [],
          parts: [],
          services: [],
          currentSpace: null,
        });
      },
      ..._effects(dispatch),
    }),
  })
}

export const nebula: any = NebulaModelWrapper(service, {}, () => ({}));