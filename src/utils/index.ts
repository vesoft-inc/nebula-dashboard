import { DashboardType, NebulaVersionType } from './interface';
import intl from 'react-intl-universal';

/**
 * this folder for utils
 */
export * from './url';

export const isCommunityVersion = () => {
  return VERSION_TYPE?.type === DashboardType.COMMUNTY;
}

export const isEnterpriseVersion = () => {
  return VERSION_TYPE?.type === DashboardType.ENTERPRISE;
}

export const isCloudVersion = () => {
  return VERSION_TYPE?.type === DashboardType.CLOUD;
}

export const isPlayGroundVersion = () => {
  return VERSION_TYPE?.type === DashboardType.PLAYGROUND;
}

export const shouldCheckCluster = () => {
  return isEnterpriseVersion() || isCloudVersion() || isPlayGroundVersion();
}

export const unique = (arr) => {
  return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}

export let getNebulaVersionName = (_versionType: NebulaVersionType, version) => {
  return `${intl.get('common.nebulaVersion.community')} ${version}`;
}

export const updateFn = (service: { 
  getNebulaVersionName: typeof getNebulaVersionName
}) => {
  getNebulaVersionName = service.getNebulaVersionName;
}

export class SessionStorageUtil {
  static setItem<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | undefined {
    const item = sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }

  static removeItem(key: string) {
    sessionStorage.removeItem(key);
  }
}