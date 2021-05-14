import { createModel } from '@rematch/core';
import cookies from 'js-cookie';
import service from '@assets/config/service';
import intl from 'react-intl-universal';
import { message } from 'antd';

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
  effects: (dispatch: any) => ({
    async asyncGetAppInfo () {
      const appInfo = await service.getAppInfo();

      this.update({
        ...appInfo,
      });
    },

    async asyncLogin ({
      username,
      password
    }){
      const { code, message: errorMessage } = (await service.connectDB({
        address: '192.168.8.157',
        // address:'192.168.10.217',
        port:9669,
        username,
        password,
      })) as any;
      if (code === 0) {
        cookies.set('nu', username);
        cookies.set('np', password);
        this.update({
          username,
          password,
        });
        return true;
      }else{
        message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
        this.update({
          username: '',
          password: '',
        });
        cookies.remove('nu', { path: '/' });
        cookies.remove('np', { path: '/' });
        return false;
      }
    },

    async asyncLogout () {
      cookies.remove('nu', { path: '/' });
      cookies.remove('np', { path: '/' });
      await this.update({
        username: '',
        password: '',
      });
      dispatch({ type: 'RESET_APP' });
    },
  })
});
