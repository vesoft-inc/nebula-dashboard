import { createModel } from '@rematch/core';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';
import { message } from 'antd';
import service from '@/config/service';

interface IState {
  version: string;
  username: string;
  aliasConfig: any;
}

export const app = createModel({
  state: {
    version: '',
    username: cookies.get('nu'),
    aliasConfig: {} as any,
    connection: {} as any,
  },
  reducers: {
    update: (state: IState, payload: any) => ({
      ...state,
      ...payload,
    }),
  },
  effects: (dispatch: any) => ({
    async asyncGetAppInfo() {
      const appInfo = await service.getAppInfo();

      this.update({
        ...appInfo,
      });
    },

    async asyncGetCustomConfig() {
      const {
        code,
        data: { connection, alias },
      } = (await service.getCustomConfig()) as any;
      if (code === 0) {
        this.update({
          aliasConfig: alias,
          connection,
        });
      }
    },

    async asyncLogin(payload: {
      password: string;
      username: string;
      ip: string;
      port: number;
    }) {
      const { password, username, ip, port } = payload;
      const { code, message: errorMessage } = (await service.connectDB(
        {
          address: ip,
          port,
          username,
          password,
        },
        {
          trackEventConfig: {
            category: 'user',
            action: 'sign_in',
          },
        },
      )) as any;
      if (code === 0) {
        cookies.set('nu', username);
        this.update({
          username,
        });
        return true;
      }
      message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
      this.update({
        username: '',
      });
      cookies.remove('nu', { path: '/' });
      return false;
    },

    async asyncLogout() {
      cookies.remove('nu', { path: '/' });
      await this.update(
        {
          username: '',
          password: '',
        },
        {
          trackEventConfig: {
            category: 'user',
            action: 'sign_out',
          },
        },
      );
      dispatch({ type: 'RESET_APP' });
    },
  }),
});
