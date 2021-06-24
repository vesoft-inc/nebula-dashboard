import { createModel } from '@rematch/core';
import cookies from 'js-cookie';
import service from '@assets/config/service';
import intl from 'react-intl-universal';
import { message } from 'antd';

interface IState {
  version: string;
  username: string;
  aliasConfig: any;
  annotationLine: any;
}

export const app = createModel({
  state: {
    version: '',
    username: cookies.get('nu'),
<<<<<<< HEAD
    aliasConfig: {} as any,
    connection: {} as any,
=======
    password: cookies.get('np'),
    aliasConfig: {},
    annotationLine: {} as any
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
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

<<<<<<< HEAD
    async asyncGetCustomConfig() {
      const { code, data:{ connection, alias } } = (await service.getCustomConfig()) as any;
=======
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
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
      if (code === 0) {
        this.update({
          aliasConfig : alias,
          connection
        });
      }
    },

<<<<<<< HEAD
    async asyncLogin(payload: {
      password:string,
      username: string,
      ip: string,
      port: number,
=======
    async asyncLogin({
      username,
      password
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    }){
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
        })) as any;
      if (code === 0) {
        cookies.set('nu', username);
        this.update({
          username,
        });
        return true;
      }else{
        message.error(`${intl.get('configServer.fail')}: ${errorMessage}`);
        this.update({
          username: '',
        });
        cookies.remove('nu', { path: '/' });
        return false;
      }
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
        });
      dispatch({ type: 'RESET_APP' });
    },
  })
});
