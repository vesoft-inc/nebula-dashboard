import intl from 'react-intl-universal';
import { VALUE_TYPE } from "@/utils/promQL";
import { BatchQueryItem, ServiceName } from '@/utils/interface';

export interface ServicePanelConfig {
  key: string;
  title: string;
  valueType: VALUE_TYPE;
  space?: string;
  showIndex?: number;
  queries: BatchQueryItem[];
}

export interface ServicePanelConfigItem {
  type: ServiceName;
  panels: ServicePanelConfig[];
};

export const defaultServicePanelConfigData: ServicePanelConfigItem[] = [
  {
    type: ServiceName.GRAPHD,
    panels: [
      {
        title: intl.get('metric_description.overview_label.graphd_latency'),
        valueType: VALUE_TYPE.latency,
        space: '',
        key: 'graphd_latency',
        queries: [
          {
            refId: 'slow_query_latency',
            query: `num_slow_queries`,
          },
          {
            refId: 'optimizer_latency',
            query: 'optimizer_latency_us',
          },
          {
            refId: 'query_latency',
            query: 'query_latency_us',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.graphd_sessions'),
        valueType: VALUE_TYPE.number,
        space: '',
        key: 'graphd_sessions',
        queries: [
          {
            refId: 'active_sessions',
            query: `num_active_sessions`,
          },
          {
            refId: 'auth_failed_sessions_bad_username_password',
            query: `num_auth_failed_sessions_bad_username_password`,
          },
          {
            refId: 'auth_failed_sessions',
            query: 'num_auth_failed_sessions',
          },
          {
            refId: 'opened_sessions',
            query: 'num_opened_sessions',
          },
          {
            refId: 'reclaimed_expired_sessions',
            query: 'num_reclaimed_expired_sessions',
          }
        ]
      },
      {
        title: intl.get('metric_description.overview_label.graphd_queries'),
        valueType: VALUE_TYPE.number,
        space: '',
        key: 'graphd_queries',
        queries: [
          {
            refId: 'active_queries',
            query: 'num_active_queries',
          },
          {
            refId: 'killed_queries',
            query: 'num_killed_queries',
          },
          {
            refId: 'queries_hit_memory_watermark',
            query: 'num_queries_hit_memory_watermark',
          },
          {
            refId: 'total_queries',
            query: 'num_queries',
          },
          {
            refId: 'query_errors',
            query: 'num_query_errors',
          },
          {
            refId: 'slow_queries',
            query: 'num_slow_queries',
          }
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_disk'),
        valueType: VALUE_TYPE.byte,
        key: 'process_disk',
        space: '',
        queries: [
          {
            refId: 'read_bytes_total',
            query: 'read_bytes_total',
          },
          {
            refId: 'wirte_bytes_total',
            query: 'write_bytes_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_cpu'),
        valueType: VALUE_TYPE.percentage,
        key: 'process_cpu',
        queries: [
          {
            refId: 'cpu_seconds_total',
            query: 'cpu_seconds_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_memory'),
        valueType: VALUE_TYPE.byte,
        key: 'process_memory',
        queries: [
          {
            refId: 'memory_bytes_gauge',
            query: 'memory_bytes_gauge',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_context_open_file_desc'),
        valueType: VALUE_TYPE.number,
        key: 'process_context_open_file_desc',
        queries: [
          {
            refId: 'context_switches_total',
            query: 'context_switches_total',
          },
          {
            refId: 'open_filedesc_gauge',
            query: `open_filedesc_gauge`,
          }
        ]
      },
    ],
  },
  {
    type: ServiceName.METAD,
    panels: [
      {
        title: intl.get('metric_description.overview_label.metad_latency'),
        valueType: VALUE_TYPE.latency,
        key: 'metad_latency',
        queries: [
          {
            refId: 'append_log_latency',
            query: `append_log_latency_us`,
          },
          {
            refId: 'append_wal_latency',
            query: 'append_wal_latency_us',
          },
          {
            refId: 'commit_log_latency',
            query: 'commit_log_latency_us',
          },
          {
            refId: 'commit_snapshot_latency',
            query: 'commit_snapshot_latency_us',
          },
          {
            refId: 'heartbeat_latency',
            query: 'heartbeat_latency_us',
          },
          {
            refId: 'replicate_log_latency',
            query: 'replicate_log_latency_us',
          },
          {
            refId: 'transfer_leader_latency',
            query: 'transfer_leader_latency_us',
          }
        ]
      },
      {
        title: intl.get('metric_description.overview_label.metad_nums'),
        valueType: VALUE_TYPE.number,
        key: 'metad_nums',
        queries: [
          {
            refId: 'num_grant_votes',
            query: 'num_grant_votes',
          },
          {
            refId: 'num_heartbeats',
            query: 'num_heartbeats',
          },
          {
            refId: 'num_send_snapshot',
            query: 'num_send_snapshot',
          },
          {
            refId: 'num_start_elect',
            query: 'num_start_elect',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_disk'),
        valueType: VALUE_TYPE.byte,
        key: 'process_disk',
        queries: [
          {
            refId: 'read_bytes_total',
            query: 'read_bytes_total',
          },
          {
            refId: 'wirte_bytes_total',
            query: 'write_bytes_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_cpu'),
        valueType: VALUE_TYPE.percentage,
        key: 'process_cpu',
        queries: [
          {
            refId: 'cpu_seconds_total',
            query: 'cpu_seconds_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_memory'),
        valueType: VALUE_TYPE.byte,
        key: 'process_memory',
        queries: [
          {
            refId: 'memory_bytes_gauge',
            query: 'memory_bytes_gauge',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_context_open_file_desc'),
        valueType: VALUE_TYPE.number,
        key: 'process_context_open_file_desc',
        queries: [
          {
            refId: 'context_switches_total',
            query: 'context_switches_total',
          },
          {
            refId: 'open_filedesc_gauge',
            query: `open_filedesc_gauge`,
          }
        ]
      },
    ],
  },
  {
    type: ServiceName.STORAGED,
    panels: [
      {
        title: intl.get('metric_description.overview_label.storage_latency'),
        valueType: VALUE_TYPE.latency,
        key: 'storage_latency',
        queries: [
          {
            refId: 'add_edges_latency',
            query: `add_edges_latency_us`,
          },
          {
            refId: 'add_vertices_latency',
            query: 'add_vertices_latency_us',
          },
          {
            refId: 'append_log_latency',
            query: 'append_log_latency_us',
          },
          {
            refId: 'commit_snapshot_latency',
            query: 'commit_snapshot_latency_us',
          },
          {
            refId: 'commit_log_latency',
            query: 'commit_log_latency_us',
          },
          {
            refId: 'delete_edges_latency',
            query: 'delete_edges_latency_us',
          },
          {
            refId: 'delete_vertices_latency',
            query: 'delete_vertices_latency_us',
          },
          {
            refId: 'get_dst_by_src_latency',
            query: 'get_dst_by_src_latency_us',
          },
          {
            refId: 'get_neighbors_latency',
            query: 'get_neighbors_latency_us',
          },
          {
            refId: 'sync_data_latency',
            query: 'sync_data_latency_us',
          },
          {
            refId: 'transfer_leader_latency',
            query: 'transfer_leader_latency_us',
          }
        ]
      },
      {
        title: intl.get('metric_description.overview_label.storaged_edge_nums'),
        valueType: VALUE_TYPE.number,
        key: 'storaged_edge_nums',
        queries: [
          {
            refId: 'num_edges_deleted',
            query: 'num_edges_deleted',
          },
          {
            refId: 'num_edges_inserted',
            query: 'num_edges_inserted',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.storaged_vertices_nums'),
        valueType: VALUE_TYPE.number,
        key: 'storaged_vertices_nums',
        queries: [
          {
            refId: 'num_vertices_deleted',
            query: 'num_vertices_deleted',
          },
          {
            refId: 'num_vertices_inserted',
            query: 'num_vertices_inserted',
          }
        ]
      },
      {
        title: intl.get('metric_description.overview_label.storaged_tag_and_dst_nums'),
        valueType: VALUE_TYPE.number,
        key: 'storaged_tag_and_dst_nums',
        queries: [
          {
            refId: 'num_tags_deleted',
            query: 'num_tags_deleted',
          },
          {
            refId: 'num_vertices_inserted',
            query: 'num_vertices_inserted',
          },
          {
            refId: 'num_get_dst_by_src_errors',
            query: 'num_get_dst_by_src_errors',
          },
          {
            refId: 'num_get_dst_by_src',
            query: 'num_get_dst_by_src',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.storaged_other_nums'),
        valueType: VALUE_TYPE.number,
        key: 'storaged_other_nums',
        queries: [
          {
            refId: 'num_grant_votes',
            query: 'num_grant_votes',
          },
          {
            refId: 'num_rpc_sent_to_metad_failed',
            query: 'num_rpc_sent_to_metad_failed',
          },
          {
            refId: 'num_rpc_sent_to_metad',
            query: 'num_rpc_sent_to_metad',
          },
          {
            refId: 'num_send_snapshot',
            query: 'num_send_snapshot',
          },
          {
            refId: 'num_start_elect',
            query: 'num_start_elect',
          },
          {
            refId: 'num_sync_data_errors',
            query: 'num_sync_data_errors',
          },
          {
            refId: 'num_sync_data',
            query: 'num_sync_data',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_disk'),
        valueType: VALUE_TYPE.byte,
        key: 'process_disk',
        queries: [
          {
            refId: 'read_bytes_total',
            query: 'read_bytes_total',
          },
          {
            refId: 'wirte_bytes_total',
            query: 'write_bytes_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_cpu'),
        valueType: VALUE_TYPE.percentage,
        key: 'process_cpu',
        queries: [
          {
            refId: 'cpu_seconds_total',
            query: 'cpu_seconds_total',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_memory'),
        valueType: VALUE_TYPE.byte,
        key: 'process_memory',
        queries: [
          {
            refId: 'memory_bytes_gauge',
            query: 'memory_bytes_gauge',
          },
        ]
      },
      {
        title: intl.get('metric_description.overview_label.process_context_open_file_desc'),
        valueType: VALUE_TYPE.number,
        key: 'process_context_open_file_desc',
        queries: [
          {
            refId: 'context_switches_total',
            query: 'context_switches_total',
          },
          {
            refId: 'open_filedesc_gauge',
            query: `open_filedesc_gauge`,
          }
        ]
      },
    ],
  },
];