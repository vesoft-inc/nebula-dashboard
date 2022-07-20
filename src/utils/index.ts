import { DashboardType } from './interface';

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