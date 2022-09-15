import semver from 'semver';

export let VERSION_FEATURES = [
  {
    version: '>=2.5.0',
    type: 'community',
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
  VERSION_FEATURES: typeof VERSION_FEATURES
}) => {
  VERSION_FEATURES = service.VERSION_FEATURES;
}
