import { DashboardType, NebulaConnectInfo, NebulaVersionType } from './interface';
import intl from 'react-intl-universal';
import cookies from 'js-cookie';

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

export let getNebulaVersionName = (versionType: NebulaVersionType, version) => {
  switch (versionType) {
    case NebulaVersionType.ENTERPRISE:
      return `${intl.get('common.nebulaVersion.enterprise')} ${version}`;
    case NebulaVersionType.COMMUNITY:
      return `${intl.get('common.nebulaVersion.community')} ${version}`;
    default:
      return `${intl.get('common.nebulaVersion.community')} ${version}`;
  }
}

export let hasNebulaConnected = (nebulaConnect?: NebulaConnectInfo, clusterID?: number): boolean => {
  return !!nebulaConnect
}

export const updateFn = (service: { 
  hasNebulaConnected: typeof hasNebulaConnected
}) => {
  hasNebulaConnected = service.hasNebulaConnected;
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

export class LocalStorageStorageUtil {
  static setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

export const clearNebulaConnection = () => {
  SessionStorageUtil.removeItem('nebulaConnect');
  cookies.remove('nsid');
}

export const getMenuPathByKey = (menuList: any[], activeKey: string): string[] => {
  let path: string[] = [];
  for(let i = 0; i < menuList.length; i++) {
    const item = menuList[i];
    if (item.key === activeKey) {
      path = [item.key];
      break;
    }
    if (item.children) {
      const childPath = getMenuPathByKey(item.children, activeKey);
      if (childPath) {
        path = [item.key, ...childPath];
        break;
      }
    }
  }
  return path;
}