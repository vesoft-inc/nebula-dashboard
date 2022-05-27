/**
 * this folder for utils
 */
export * from './url';

export const isCommunityVersion = () => {
  return VERSION_TYPE?.type === 'community';
}

export const isEnterpriseVersion = () => {
  return VERSION_TYPE?.type === 'enterprise';
}

export const isCloudVersion = () => {
  return VERSION_TYPE?.type === 'cloud';
}

export const shouldCheckCluster = () => {
  return isEnterpriseVersion() || isCloudVersion();
}

export const unique = (arr) => {
  return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}