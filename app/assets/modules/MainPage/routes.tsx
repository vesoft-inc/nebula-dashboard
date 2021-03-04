import { lazy } from 'react';
import intl from 'react-intl-universal';

const MachineDashboard = lazy(() => import('@assets/modules/MachineDashboard'));
const ServiceOverview = lazy(() => import('@assets/modules/ServiceOverview'));
const QPSMetrics = lazy(() => import('@assets/modules/QPSMetrics'));
const VersionStatistic = lazy(() => import('@assets/modules/VersionStatistic'));
const LeaderDistribution = lazy(() => import('@assets/modules/LeaderDistribution'));
const PartitionDistribution = lazy(() => import('@assets/modules/PartitionDistribution'));
const ServiceInfo = lazy(() => import('@assets/modules/ServiceManage/ServiceInfo'));
const PartitionInfo = lazy(() => import('@assets/modules/ServiceManage/PartitionInfo'));
const ConfigInfo = lazy(() => import('@assets/modules/ServiceManage/ConfigInfo'));
const Snapshot = lazy(() => import('@assets/modules/ServiceManage/Snapshot'));
const LongTermTask = lazy(() => import('@assets/modules/ServiceManage/LongTermTask'));
const CPUDetail = lazy(() => import('@assets/modules/MachineDashboard/Detail/CPUDetail'));
const DiskDetail = lazy(() => import('@assets/modules/MachineDashboard/Detail/DiskDetail'));
const FlowDetail = lazy(() => import('@assets/modules/MachineDashboard/Detail/FlowDetail'));
const MemoryDetail = lazy(() => import('@assets/modules/MachineDashboard/Detail/MemoryDetail'));

export const MenuList = [{
  key: 'dashboard',
  title: intl.get('common.dashboard'),
  icon: '#iconnav-dashboard',
  children: [{
    key: 'machine-dashboard',
    title: intl.get('common.machine'),
    icon: '#iconnav-machine',
    path: '/machine-dashboard'
  },{
    key: 'service-dashboard',
    title: intl.get('common.service'),
    icon: '#iconnav-service',
    path: '/service-dashboard'
  }]
},{
  key: 'serviceManagement',
  title: intl.get('common.serviceManagement'),
  icon: '#iconnav-serverControl',
  children: [{
    key: 'service-info',
    title: intl.get('common.serviceInfo'),
    icon: '#iconnav-serverInfo',
    path: '/service-info'
  },{
    key: 'partition-info',
    title: intl.get('common.partitionInfo'),
    icon: '#iconnav-partitionInfo',
    path: '/partition-info'
  },{
    key: 'config-info',
    title: intl.get('common.config'),
    icon: '#iconnav-configuration',
    path: '/config-info'
  },{
    key: 'snapshot',
    title: intl.get('common.snapshot'),
    icon: '#iconnav-snapshot',
    path: '/snapshot'
  },{
    key: 'long-term-task',
    title: intl.get('common.longTermTask'),
    icon: '#iconnav-timeConsuming',
    path: '/long-term-task'
  }]
}];

const MACHINE_VIEWS = [{
  label: '机器概况',
  value: '/machine-dashboard'
},{
  label: 'CPU详情',
  value: '/machine-dashboard/cpu'
},{
  label: '磁盘详情',
  value: '/machine-dashboard/disk'
},{
  label: '内存详情',
  value: '/machine-dashboard/memory'
},{
  label: '流量详情',
  value: '/machine-dashboard/flow'
}];

const SERVICE_VIEWS = [{
  label: '服务概况',
  value: '/service-dashboard'
},{
  label: '时序指标',
  value: '/service-dashboard/qps-metrics'
},{
  label: '版本详情',
  value: '/service-dashboard/version-statistics'
},{
  label: 'Leader分布',
  value: '/service-dashboard/leader-distribution'
},{
  label: 'Partition分布',
  value: '/service-dashboard/partition-distribution'
}];

export const RoutesList = [
  {
    path: '/machine-dashboard',
    component: MachineDashboard,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/machine-dashboard',
        breadcrumbName: intl.get('common.machine'),
      }],
      title: intl.get('common.machine'),
      extra: MACHINE_VIEWS
    }
  },
  {
    path: '/machine-dashboard/cpu',
    component: CPUDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/machine-dashboard',
        breadcrumbName: intl.get('common.machine'),
      },{
        path: '/machine-dashboard/cpu',
        breadcrumbName: 'CPU Detail',
      }],
      showBackBtn: true,
      title: 'CPU Detail',
      extra: MACHINE_VIEWS
    }
  },
  {
    path: '/machine-dashboard/disk',
    component: DiskDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/machine-dashboard',
        breadcrumbName: intl.get('common.machine'),
      },{
        path: '/machine-dashboard/disk',
        breadcrumbName: 'Disk Detail',
      }],
      showBackBtn: true,
      title: 'Disk Detail',
      extra: MACHINE_VIEWS
    }
  },
  {
    path: '/machine-dashboard/memory',
    component: MemoryDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/machine-dashboard',
        breadcrumbName: intl.get('common.machine'),
      },{
        path: '/machine-dashboard/memory',
        breadcrumbName: 'Memory Detail',
      }],
      showBackBtn: true,
      title: 'Memory Detail',
      extra: MACHINE_VIEWS
    }
  },
  {
    path: '/machine-dashboard/flow',
    component: FlowDetail,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/machine-dashboard',
        breadcrumbName: intl.get('common.machine'),
      },{
        path: '/machine-dashboard/flow',
        breadcrumbName: 'Flow Detail',
      }],
      showBackBtn: true,
      title: 'Flow Detail',
      extra: MACHINE_VIEWS
    }
  },
  {
    path: '/service-dashboard',
    component: ServiceOverview,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/service-dashboard',
        breadcrumbName: intl.get('common.service'),
      }],
      title: intl.get('common.service'),
      extra: SERVICE_VIEWS
    }
  },
  {
    path: '/service-dashboard/qps-metrics',
    component: QPSMetrics,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/service-dashboard',
        breadcrumbName: intl.get('common.service'),
      },{
        path: '/service-dashboard/qps-metrics',
        breadcrumbName: '服务指标详情',
      }],
      title: '服务指标详情',
      showBackBtn: true,
      extra: SERVICE_VIEWS
    }
  },
  {
    path: '/service-dashboard/version-statistics',
    component: VersionStatistic,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/service-dashboard',
        breadcrumbName: intl.get('common.service'),
      },{
        path: '/service-dashboard/version-statistics',
        breadcrumbName: '服务指标详情',
      }],
      title: '服务指标详情',
      showBackBtn: true,
      extra: SERVICE_VIEWS
    }
  },
  {
    path: '/service-dashboard/leader-distribution',
    component: LeaderDistribution,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/service-dashboard',
        breadcrumbName: intl.get('common.service'),
      },{
        path: '/service-dashboard/leader-distribution',
        breadcrumbName: '服务指标详情',
      }],
      title: '服务指标详情',
      showBackBtn: true,
      extra: SERVICE_VIEWS
    }
  },
  {
    path: '/service-dashboard/partition-distribution',
    component: PartitionDistribution,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.dashboard'),
      },{
        path: '/service-dashboard',
        breadcrumbName: intl.get('common.service'),
      },{
        path: '/service-dashboard/partition-distribution',
        breadcrumbName: '服务指标详情',
      }],
      title: '服务指标详情',
      showBackBtn: true,
      extra: SERVICE_VIEWS
    }
  },
  {
    path: '/service-info',
    component: ServiceInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.serviceManagement'),
      },{
        path: '/service-info',
        breadcrumbName: intl.get('common.serviceInfo'),
      }],
      title: intl.get('common.serviceInfo'),
    }
  },
  {
    path: '/partition-info',
    component: PartitionInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.serviceManagement'),
      },{
        path: '/partition-info',
        breadcrumbName: intl.get('common.partitionInfo'),
      }],
      title: intl.get('common.partitionInfo'),
    }
  },
  {
    path: '/config-info',
    component: ConfigInfo,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.serviceManagement'),
      },{
        path: '/config-info',
        breadcrumbName: intl.get('common.config'),
      }],
      title: intl.get('common.config'),
    }
  },
  {
    path: '/snapshot',
    component: Snapshot,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.serviceManagement'),
      },{
        path: '/snapshot',
        breadcrumbName: intl.get('common.snapshot'),
      }],
      title: intl.get('common.snapshot'),
    }
  },
  {
    path: '/long-term-task',
    component: LongTermTask,
    exact: true,
    headerConfig: {
      breadcrumb: [{
        path: '#',
        breadcrumbName: intl.get('common.serviceManagement'),
      },{
        path: '/long-term-task',
        breadcrumbName: intl.get('common.longTermTask'),
      }],
      title: intl.get('common.longTermTask'),
    }
  }
];