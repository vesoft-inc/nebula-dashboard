import { CellHealtyLevel, DashboardType, NebulaConnectInfo, NebulaVersionType, Percent_Range } from './interface';
import intl from 'react-intl-universal';

import { getProperStep } from './dashboard';

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

export const calcNodeHealty = (percent: number, rangeMap = Percent_Range) => {
  const levels = Object.keys(rangeMap);
  let level: CellHealtyLevel = CellHealtyLevel.normal ;
  for (let index = 0; index < levels.length; index++) {
    const key = levels[index];
    const [start, end] = Percent_Range[key];
    if (percent >= start && percent < end) {
      level = key as CellHealtyLevel;
      break;
    }
  }
  return level;
}

export const getQueryRangeInfo = (start: number, end: number) => {
  const step = getProperStep(start, end);
  start = start / 1000;
  end = end / 1000;
  start = start - start % step;
  end -= end % step
  return {
    start,
    end,
    step,
  }
}

export const getNebulaProductName = () => {
  const currentType = (window as any).CurrentClusterType;
  if (!currentType) return process.env.PRODUCT_NAME || 'NebulaGraph';
  if (currentType === NebulaVersionType.COMMUNITY) {
    return process.env.COMMUNITY_PRODUCT_NAME || 'NebulaGraph';
  }
  return process.env.PRODUCT_NAME || 'NebulaGraph';
}

export const handleEscape = (name: string) => name.replace(/\\/gm, '\\\\').replace(/`/gm, '\\`');

export const getUseSapceNgql = (space: string) => {
  return `USE \`${handleEscape(space)}\``;
}