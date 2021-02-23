import { message as AntdMessage } from 'antd';
import axios from 'axios';
import intl from 'react-intl-universal';

import { store } from '@assets/store';

const service = axios.create();

service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';

  return config;
});

service.interceptors.response.use(
  (response: any) => {
    const { code, message } = response.data;
    let _code;
    if ('code' in response.data) {
      _code = code;
    } else { // response from prometheus api
      _code = response.data.status === 'success' ? 0 : -1;
      response.data.code = _code;
    }

    // if connection refused, login again
    if (code === -1 && message && message.includes('connection refused')) {
      AntdMessage.warning(intl.get('warning.connectError'));
      store.dispatch({
        type: 'nebula/clearConfig',
      });
    }
    return response.data;
  },
  (error: any) => {
    AntdMessage.error(
      `${intl.get('common.requestError')}: ${error.response.status} ${
        error.response.statusText
      }`,
    );
    return error.response;
  },
);

const get = (api: string) => (params?: object, config = {}) =>
  service.get(api, { params, ...config });

const post = (api: string) => (params?: object, config = {}) =>
  service.post(api, params, config);
const put = (api: string) => (params?: object, config = {}) =>
  service.put(api, params, config);

const _delete = (api: string) => (params?: object) =>
  service.delete(api, params);

export { get, post, put, _delete };
