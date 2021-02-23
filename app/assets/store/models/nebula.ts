import { createModel } from '@rematch/core';
import _ from 'lodash';
import { message } from 'antd';
import service from '@assets/config/service';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';

interface IState {
  configs:any[];
  snapshots: any[];
  jobs: any[];
  spaces: string[];
  parts:any[];
  services: any[];
}

export const nebula = createModel({
  state: {
    configs:[],
    snapshots:[],
    jobs:[],
    spaces:[],
    parts:[],
    services:[]
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
    async asyncGetServiceConfigs (module?:string) {
      const { code, data } = (await service.execNGQL({
        gql: module ? `SHOW CONFIGS ${module} `:'SHOW CONFIGS'
      })) as any;
      if (code === 0) {
        this.update({
          configs: data.tables ?  data.tables : [],
        });
      }
    },

    async asyncGetSnapshots () {
      const { code, data } = (await service.execNGQL({
        gql: 'SHOW SNAPSHOTS'
      })) as any;
      if (code === 0) {
        this.update({
          snapshots: data.tables ?  data.tables : [],
        });
      }
    },

    async asyncGetJobs () {
      const { code, data } = (await service.execNGQL({
        gql: 'SHOW JOBS'
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          jobs: data.tables,
        });
      }
    },

    async asyncGetSpaces () {
      const { code, data } = (await service.execNGQL({
        gql: 'SHOW SPACES'
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          spaces: data.tables ?  data.tables : [],
        });
      }
    },

    async asyncGetParts (partId?:string) {
      const { code, data } = (await service.execNGQL({
        gql: partId ? `SHOW PARTS ${partId}`:'SHOW PARTS'
      })) as any;
      if (code === 0 && data.tables) {
        this.update({
          parts: data.tables,
        });
      }
    },

    async asyncGetServices () {
      const { code, data: hostData } = (await service.execNGQL({
        gql: 'SHOW HOSTS'
      })) as any;
      if (code === 0) {
        let data = [];
        const { code: storageCode, data: storageData } = (await service.execNGQL({
          gql: 'SHOW HOSTS STORAGE'
        })) as any;
        if(storageCode === 0){
          data = hostData.tables.map(host => {
            const storage = storageData.tables.find(storage => storage.Host === host.Host);
            return{
              ...host,
              ...storage,
            };
          });
        }
        this.update({
          services: data,
        });
      }
    },

    // HACK: Fixed information
    async asyncLogin ({
      username,
      password
    }){
      const { code, message: errorMessage } = (await service.connectDB({
        address:'192.168.10.107',
        port:'9669',
        username,
        password,
      })) as any;
      if (code === 0) {
        cookies.set('nu', username);
        cookies.set('np', password);
        return true;
      }else{
        message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
        return false;
      }
    }
  },
});
