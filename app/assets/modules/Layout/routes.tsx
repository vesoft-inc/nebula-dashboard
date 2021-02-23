import { lazy } from 'react';
import intl from 'react-intl-universal';

const MachineDashboard = lazy(() => import('@assets/modules/MachineDashboard'));
const ServiceOverview = lazy(() => import('@assets/modules/ServiceOverview'));
const ServerMetrics = lazy(() => import('@assets/modules/ServerMetrics'));
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
export const RoutesList = [
  {
    path: '/machine-dashboard',
    component: MachineDashboard,
    exact: true,
  },
  {
    path: '/machine-dashboard/cpu',
    component: CPUDetail,
    exact: true
  },
  {
    path: '/machine-dashboard/disk',
    component: DiskDetail,
    exact: true
  },
  {
    path: '/machine-dashboard/memory',
    component: MemoryDetail,
    exact: true
  },
  {
    path: '/machine-dashboard/flow',
    component: FlowDetail,
    exact: true
  },
  {
    path: '/service-dashboard',
    component: ServiceOverview,
    exact: true,
  },
  {
    path: '/service-dashboard/server-metrics',
    component: ServerMetrics,
    exact: true,
  },
  {
    path: '/service-dashboard/version-statistics',
    component: VersionStatistic,
    exact: true,
  },
  {
    path: '/service-dashboard/leader-distribution',
    component: LeaderDistribution,
    exact: true,
  },
  {
    path: '/service-dashboard/partition-distribution',
    component: PartitionDistribution,
    exact: true,
  },
  {
    path: '/service-info',
    component: ServiceInfo,
    exact: true,
  },
  {
    path: '/partition-info',
    component: PartitionInfo,
    exact: true,
  },
  {
    path: '/config-info',
    component: ConfigInfo,
    exact: true,
  },
  {
    path: '/snapshot',
    component: Snapshot,
    exact: true,
  },
  {
    path: '/long-term-task',
    component: LongTermTask,
    exact: true,
  }
];