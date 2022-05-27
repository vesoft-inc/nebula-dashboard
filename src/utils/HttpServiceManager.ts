
import axios, { AxiosInstance } from 'axios';
import { trackEvent } from './stat';

export class HttpSeriveManager {

  public static axiosInstance: AxiosInstance;

  static get _axiosInstance(): AxiosInstance {
    if (!HttpSeriveManager.axiosInstance) {
      HttpSeriveManager.axiosInstance = axios.create({
        timeout: 10000
      });
    }
    return HttpSeriveManager.axiosInstance
  }

  private trackService = (res, config) => {
    const { category, action } = config;
    trackEvent(category, action, res.code === 0 ? 'ajax_success' : 'ajax_failed');
  };

  public sendRequest = async (type: string, api: string, params?, config?) => {
    const { trackEventConfig, ...otherConfig } = config;
    let res;
    switch (type) {
      case 'get':
        res = (await HttpSeriveManager.axiosInstance.get(api, { params, ...otherConfig })) as any;
        break;
      case 'post':
        res = (await HttpSeriveManager.axiosInstance.post(api, params, otherConfig)) as any;
        break;
      case 'put':
        res = (await HttpSeriveManager.axiosInstance.put(api, params, otherConfig)) as any;
        break;
      case 'delete':
        res = (await HttpSeriveManager.axiosInstance.delete(api, params)) as any;
        break;
      default:
        break;
    }
  
    if (res && trackEventConfig) {
      this.trackService(res, trackEventConfig);
    }
    return res;
  };
}