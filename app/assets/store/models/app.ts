import { createModel } from '@rematch/core';
import cookies from 'js-cookie';
import service from '@assets/config/service';

interface IState {
  version: string;
  username: string;
  password: string;
}

export const app = createModel({
  state: {
    version: '',
    username: cookies.get('nu'),
    password: cookies.get('np'),
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
    async asyncGetAppInfo() {
      const appInfo = await service.getAppInfo();

      this.update({
        ...appInfo,
      });
    },
  },
});
