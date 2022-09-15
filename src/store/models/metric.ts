import { createModel } from '@rematch/core';
import _ from 'lodash';
import { compare } from 'compare-versions';
import service from '@/config/service';
import { filterServiceMetrics } from '@/utils/metric';
import { getClusterPrefix, diskPararms } from '@/utils/promQL';

interface IState {
  graphd: any[];
  metad: any;
  storaged: any[];
  spaces: string[];
  devices: string[]
}

export function MetricModelWrapper(serviceApi) {
  return createModel({
    state: {
      graphd: [],
      metad: [],
      storaged: [],
      spaces: [],
      devices: []
    },
    reducers: {
      update: (state: IState, payload: any) => ({
        ...state,
        ...payload,
      }),
    },
    effects: () => ({
      async asyncGetServiceMetric(payload: {
        clusterID?: string;
        componentType: string;
        version: string;
      }) {
        const { componentType, version, clusterID } = payload;
        let metricList = [];
        let spaceMetricList = [];
        const clusterSuffix1 = clusterID ? `,${getClusterPrefix()}='${clusterID}'` : '';
        switch (true) {
          case compare(version, 'v3.0.0', '<'): {
            const { code, data } = (await serviceApi.getMetrics({
              clusterID,
              'match[]': `{componentType="${componentType}",__name__!~"ALERTS.*",__name__!~".*count"${clusterSuffix1}}`,
            })) as any;
            if (code === 0) {
              metricList = data;
            }
            break;
          }
          case compare(version, 'v3.0.0', '>='):
            {
              const { code, data } = (await serviceApi.getMetrics({
                clusterID,
                'match[]': `{componentType="${componentType}",space!="",__name__!~"ALERTS.*",__name__!~".*count"${clusterSuffix1}}`,
              })) as any;
              if (code === 0) {
                spaceMetricList = data;
                const { code: _code, data: metricData } =
                  (await serviceApi.getMetrics({
                    clusterID,
                    'match[]': `{componentType="${componentType}",space="",__name__!~"ALERTS.*",__name__!~".*count"${clusterSuffix1}}`,
                  })) as any;
                if (_code === 0) {
                  metricList = metricData;
                }
              }
            }
            break;
          default:
            break;
        }
        const metrics = filterServiceMetrics({
          metricList,
          componentType,
          spaceMetricList,
          version,
        });
        this.update({
          [componentType]: metrics,
        });
      },
      async asyncGetSpaces({ clusterID, start, end }) {
        start = start / 1000;
        end = end / 1000;
        const { data: res } = (await service.getSpaces({ 
          'match[]': clusterID ? `{${getClusterPrefix()}='${clusterID}'}` : undefined,
          start, 
          end
        })) as any;
        if (Array.isArray(res)) {
          this.update({
            spaces: res,
          });
        } else if (res.code === 0) {
          this.update({
            spaces: res.data,
          });
        }
      },
      async asyncDevices(clusterID ) {
        const { data: res } = (await service.getDevices({ 
          'match[]': clusterID ? `{${diskPararms}, ${getClusterPrefix()}='${clusterID}'}` : undefined,
        })) as any;
        if (Array.isArray(res)) {
          this.update({
            devices: res,
          });
        } else if (res.code === 0) {
          this.update({
            devices: res.data,
          });
        }
      },
    }),
  });
}

export const serviceMetric = MetricModelWrapper(service);
