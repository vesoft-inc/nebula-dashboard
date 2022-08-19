import intl from 'react-intl-universal';
import LoadDetail from '../MachineDashboard/Detail/LoadDetail';
import MachineDashboard from '@/pages/MachineDashboard';
import ServiceDashboard from '@/pages/ServiceDashboard';
import ServiceDetail from '@/pages/ServiceDashboard/Detail';
import VersionStatistic from '@/pages/VersionStatistic';
import LeaderDistribution from '@/pages/LeaderDistribution';
import PartitionDistribution from '@/pages/PartitionDistribution';
import ServiceInfo from '@/pages/ServiceManage/ServiceInfo';
import PartitionInfo from '@/pages/ServiceManage/PartitionInfo';
import ConfigInfo from '@/pages/ServiceManage/ConfigInfo';
import LongTermTask from '@/pages/ServiceManage/LongTermTask';
import CPUDetail from '@/pages/MachineDashboard/Detail/CPUDetail';
import DiskDetail from '@/pages/MachineDashboard/Detail/DiskDetail';
import NetworkDetail from '@/pages/MachineDashboard/Detail/NetworkDetail';
import MemoryDetail from '@/pages/MachineDashboard/Detail/MemoryDetail';
import MetricDetail from '@/pages/MetricDetail';

export const MenuList = [
  {
    key: 'machine',
    title: intl.get('device.title'),
    icon: '#iconnav-machine',
    children: [
      {
        key: 'machine-overview',
        title: intl.get('device.overview'),
        icon: '#iconnav-dashboard',
        path: '/machine/overview',
      },
      {
        key: 'cpu',
        title: intl.get('device.cpu'),
        icon: '#iconnav-cpu',
        path: '/machine/cpu',
      },
      {
        key: 'memory',
        title: intl.get('device.memory'),
        icon: '#iconnav-ram',
        path: '/machine/memory',
      },
      {
        key: 'load',
        title: intl.get('device.load'),
        icon: '#iconnav-load',
        path: '/machine/load',
      },
      {
        key: 'disk',
        title: intl.get('device.disk'),
        icon: '#iconnav-disk',
        path: '/machine/disk',
      },
      {
        key: 'network',
        title: intl.get('device.network'),
        icon: '#iconnav-net',
        path: '/machine/network',
      },
    ],
  },
  {
    key: 'service',
    title: intl.get('common.service'),
    icon: '#iconnav-servise',
    children: [
      {
        key: 'service-overview',
        title: intl.get('device.overview'),
        icon: '#iconnav-serverdashboard',
        path: '/service/overview',
      },
      {
        key: 'graph-metrics',
        title: 'Graph',
        icon: '#iconnav-graph',
        path: '/service/graph-metrics',
      },
      {
        key: 'meta-metrics',
        title: 'Meta',
        icon: '#iconnav-meta',
        path: '/service/meta-metrics',
      },
      {
        key: 'storage-metrics',
        title: 'Storage',
        icon: '#iconnav-storage',
        path: '/service/storage-metrics',
      },
    ],
  },
  {
    key: 'management',
    title: intl.get('common.serviceManagement'),
    icon: '#iconnav-serverControl',
    children: [
      {
        key: 'service-info',
        title: intl.get('common.serviceInfo'),
        icon: '#iconnav-serverInfo',
        path: '/management/service-info',
      },
      {
        key: 'partition-info',
        title: intl.get('common.partitionInfo'),
        icon: '#iconnav-partitionInfo',
        path: '/management/partition-info',
      },
      {
        key: 'config-info',
        title: intl.get('common.config'),
        icon: '#iconnav-configuration',
        path: '/management/config-info',
      },
      {
        key: 'long-term-task',
        title: intl.get('common.longTermTask'),
        icon: '#iconnav-timeConsuming',
        path: '/management/long-term-task',
      },
    ],
  },
];

const SERVICE_VIEWS = [
  {
    label: intl.get('common.overview'),
    value: '/service/overview',
  },
  {
    label: intl.get('common.version'),
    value: '/service/version-statistics',
  },
  {
    label: 'Leader',
    value: '/service/leader-distribution',
  },
  {
    label: 'Partition',
    value: '/service/partition-distribution',
  },
];

export const RoutesList: any = [
  {
    path: '/machine/overview',
    component: MachineDashboard,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
      ],
      title: intl.get('common.machine'),
    },
  },
  {
    path: '/metrics-detail/:metricType/:metricName',
    component: MetricDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
      ],
      showBackBtn: true,
      title: intl.get('common.machine'),
    },
  },
  {
    path: '/machine/cpu',
    component: CPUDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
        {
          path: '/machine/cpu',
          breadcrumbName: intl.get('device.cpu'),
        },
      ],
      showBackBtn: true,
      title: intl.get('device.cpu'),
    },
  },
  {
    path: '/machine/disk',
    component: DiskDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
        {
          path: '/machine/disk',
          breadcrumbName: intl.get('device.disk'),
        },
      ],
      showBackBtn: true,
      title: intl.get('device.disk'),
    },
  },
  {
    path: '/machine/memory',
    component: MemoryDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
        {
          path: '/machine/memory',
          breadcrumbName: intl.get('device.memory'),
        },
      ],
      showBackBtn: true,
      title: intl.get('device.memory'),
    },
  },
  {
    path: '/machine/load',
    component: LoadDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
        {
          path: '/machine/load',
          breadcrumbName: intl.get('device.load'),
        },
      ],
      showBackBtn: true,
      title: intl.get('device.load'),
    },
  },
  {
    path: '/machine/network',
    component: NetworkDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/machine',
          breadcrumbName: intl.get('common.machine'),
        },
        {
          path: '/machine/network',
          breadcrumbName: intl.get('device.network'),
        },
      ],
      showBackBtn: true,
      title: intl.get('device.network'),
    },
  },
  {
    path: '/service/overview',
    component: ServiceDashboard,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
      ],
      title: intl.get('common.service'),
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service-metrics/detail/:metricName',
    component: MetricDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
      ],
      showBackBtn: true,
      title: intl.get('common.machine'),
    },
  },
  {
    path: '/service/graph-metrics',
    component: ServiceDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/graph-metrics',
          breadcrumbName: 'Graph',
        },
      ],
      title: 'Graph',
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service/meta-metrics',
    component: ServiceDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/meta-metrics',
          breadcrumbName: 'Meta',
        },
      ],
      title: 'Meta',
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service/storage-metrics',
    component: ServiceDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/storage-metrics',
          breadcrumbName: 'Storage',
        },
      ],
      title: 'Storage',
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service/version-statistics',
    component: VersionStatistic,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/version-statistics',
          breadcrumbName: intl.get('service.serviceMetricsDetails'),
        },
      ],
      title: intl.get('service.serviceMetricsDetails'),
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service/leader-distribution',
    component: LeaderDistribution,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/leader-distribution',
          breadcrumbName: intl.get('service.serviceMetricsDetails'),
        },
      ],
      title: intl.get('service.serviceMetricsDetails'),
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/service/partition-distribution',
    component: PartitionDistribution,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.dashboard'),
        },
        {
          path: '/service/overview',
          breadcrumbName: intl.get('common.service'),
        },
        {
          path: '/service/partition-distribution',
          breadcrumbName: intl.get('service.serviceMetricsDetails'),
        },
      ],
      title: intl.get('service.serviceMetricsDetails'),
      showBackBtn: true,
      extra: SERVICE_VIEWS,
    },
  },
  {
    path: '/management/service-info',
    component: ServiceInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.serviceManagement'),
        },
        {
          path: '/management/service-info',
          breadcrumbName: intl.get('common.serviceInfo'),
        },
      ],
      title: intl.get('common.serviceInfo'),
    },
  },
  {
    path: '/management/partition-info',
    component: PartitionInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.serviceManagement'),
        },
        {
          path: '/management/partition-info',
          breadcrumbName: intl.get('common.partitionInfo'),
        },
      ],
      title: intl.get('common.partitionInfo'),
    },
  },
  {
    path: '/management/config-info',
    component: ConfigInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.serviceManagement'),
        },
        {
          path: '/management/config-info',
          breadcrumbName: intl.get('common.config'),
        },
      ],
      title: intl.get('common.config'),
    },
  },
  {
    path: '/management/long-term-task',
    component: LongTermTask,
    exact: true,
    headerConfig: {
      breadcrumb: [
        {
          path: '#',
          breadcrumbName: intl.get('common.serviceManagement'),
        },
        {
          path: '/management/long-term-task',
          breadcrumbName: intl.get('common.longTermTask'),
        },
      ],
      title: intl.get('common.longTermTask'),
    },
  },
];
