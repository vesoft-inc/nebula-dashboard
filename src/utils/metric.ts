import _ from 'loadsh';
import { VALUE_TYPE } from '@/utils/promQL';

export const METRICS_DESCRIPTION: any = {
  num_queries: 'num_queries description',
  num_slow_queries: 'num_slow_queries description',
  query_latency_us: 'query_latency_us description',
  slow_query_latency_us: 'slow_query_latency_us description',
  num_query_errors: 'num_query_errors description',
  add_edges_atomic_latency_us: 'add_edges_atomic_latency_us description',
  add_edges_latency_us: 'add_edges_latency_us description',
  add_vertices_latency_us: 'add_vertices_latency_us description',
  delete_edges_latency_us: 'delete_edges_latency_us description',
  delete_vertices_latency_us: 'delete_vertices_latency_us description',
  forward_tranx_latency_us: 'forward_tranx_latency_us description',
  get_neighbors_latency_us: 'get_neighbors_latency_us description',
  heartbeat_latency_us: 'heartbeat_latency_us description',
  num_heartbeats: 'num_heartbeats description',
};

export const METRIC_SERVICE_TYPES = ['graph', 'storage', 'meta'];

export const FILTER_METRICS = [
  // <= v2.5.1
  'get_prop_latency_us',
  'get_value_latency_us',
  'lookup_latency_us',
  'num_add_edges_atomic_errors',
  'num_add_edges_atomic',
  'num_add_edges_errors',
  'num_add_edges',
  'num_add_vertices_errors',
  'num_add_vertices',
  'num_delete_edges_errors',
  'num_delete_edges',
  'num_delete_vertices_errors',
  'num_delete_vertices',
  'num_forward_tranx_errors',
  'num_forward_tranx',
  'num_get_neighbors_errors',
  'num_get_neighbors',
  'num_get_prop_errors',
  'num_get_prop',
  'num_get_value_errors',
  'num_get_value',
  'num_lookup_errors',
  'num_lookup',
  'num_scan_edge_errors',
  'num_scan_edge',
  'num_scan_vertex_errors',
  'num_scan_vertex',
  'num_update_edge_errors',
  'num_update_edge',
  'num_update_vertex_errors',
  'num_update_vertex',
  'scan_edge_latency_us',
  'scan_vertex_latency_us',
  'update_edge_latency_us',
  'update_vertex_latency_us',
  // <= v2.6.1
  'num_delete_tags_errors',
  'num_delete_tags',
  'delete_tags_latency_us',
  // =3.0.0
  'num_kv_get_errors',
  'num_kv_get',
  'num_kv_put_errors',
  'num_kv_put',
  'num_kv_remove_errors',
  'num_kv_remove',
  'kv_get_latency_us',
  'kv_put_latency_us',
  'kv_remove_latency_us',
  'num_agent_heartbeats',
  'agent_heartbeat_latency_us',
  'num_auth_failed_sessions_out_of_max_allowed',
];

export const METRIC_PROCESS_TYPES = ['graphd', 'storaged', 'metad'];

export const filterServiceMetrics = (payload: {
  metricList: string[];
  spaceMetricList: string[];
  version?: string;
  componentType: string;
}) => {
  const { metricList, spaceMetricList = [], componentType } = payload;
  const metrics = [] as any;
  // const metricValue = item.slice(0, item.lastIndexOf(`_${componentType}_`));
  metricList.map(item => {
    const [metricFieldType, metricFields] = item.split(`_${componentType}_`); // Example: nebula_graphd_num_queries_sum_60 =>  nebula, num_queries_sum_60
    if (metricFieldType && metricFields) {
      const metricFieldArr = metricFields.split(`_`);
      const key = metricFieldArr?.splice(-2, 2)[0]; // sum / avg / p99 ~
      const metricValue = metricFieldArr.join('_'); // nebula_graphd_num_queries
      const metricItem = _.find(metrics, m => m.metric === metricValue);

      if (_.includes(FILTER_METRICS, metricValue)) {
        // is filter metric
        return;
      }
      const isSpaceMetric = _.findLast(spaceMetricList, metric =>
        metric.includes(metricValue),
      );
      // push data in metrics
      if (metricItem) {
        const metricTypeItem = _.find(
          metricItem.metricType,
          _item => _item.key === key,
        );
        if (!metricTypeItem) {
          metricItem.metricType.push({
            key,
            value: `${metricFieldType}_${componentType}_${metricValue}_${key}_`,
          });
        }
      } else {
        metrics.push({
          metric: metricValue,
          valueType: VALUE_TYPE.number,
          isSpaceMetric: !!isSpaceMetric,
          metricType: [
            {
              key,
              value: `${metricFieldType}_${componentType}_${metricValue}_${key}_`,
            },
          ],
        });
      }
    }
  });
  return metrics;
};
