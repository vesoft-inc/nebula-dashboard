import { createModel } from '@rematch/core';
import cookies from 'js-cookie';
import service from '@assets/config/service';
import intl from 'react-intl-universal';
import { message } from 'antd';
import customConfig from '@assets/config/custom';

interface IState {
  version: string;
  username: string;
  password: string;
  aliasConfig: any;
  annotationLine: any;
}

export const app = createModel({
  state: {
    version: '',
    username: cookies.get('nu'),
    password: cookies.get('np'),
    aliasConfig: {},
    annotationLine: {} as any
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
    async asyncGetAppInfo() {
      const appInfo = await service.getAppInfo();

      this.update({
        ...appInfo,
      });
    },

    async asyncGetAnnotationLineInfo() {
      const { code, data } = await service.getAnnotationLineConfig() as any;
      if(code === 0){
        this.update({
          annotationLine:data,
        });
      }
    },

    async asyncGetAliasConfig() {
      const { code, data } = (await service.getAliasConfig()) as any;
      if (code === 0) {
        this.update({
          aliasConfig: data
        });
      }
    },

    async asyncLogin({
      username,
      password
    }){
      const { code, message: errorMessage } = (await service.connectDB({
        address: customConfig.connection.ip,
        port: customConfig.connection.port,
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

    async asyncLogout() {
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
