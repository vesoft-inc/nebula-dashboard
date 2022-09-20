import semver from 'semver';
import { NebulaVersionType, VersionFeatureInfo } from './interface';

export let VERSION_FEATURES: VersionFeatureInfo[] = [
  {
    version: '>=2.5.0',
    type: NebulaVersionType.COMMUNITY,
    feature: {
      dataBalance: false
    },
  },
];

export function getVersionFeatures(version, type) {
  const features = VERSION_FEATURES.find(
    item => type === item.type && semver.satisfies(version, item.version),
  );
  return features?.feature;
}


export const updateFn = (service: { 
  VERSION_FEATURES: VersionFeatureInfo[]
}) => {
  VERSION_FEATURES = service.VERSION_FEATURES;
}
