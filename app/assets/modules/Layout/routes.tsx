import { lazy } from 'react';
import intl from 'react-intl-universal';

const MachineDashboard = lazy(() => import('@assets/modules/MachineDashboard'));
const ServiceOverview = lazy(() => import('@assets/modules/ServiceOverview'));
const ServerMetrics = lazy(() => import('@assets/modules/ServerMetrics'));
const VersionStatistic = lazy(() => import('@assets/modules/VersionStatistic'));
const LeaderDistribution = lazy(() => import('@assets/modules/LeaderDistribution'));
const PartitionDistribution = lazy(() => import('@assets/modules/PartitionDistribution'));

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
    key: 'service',
    title: intl.get('common.service'),
    icon: '#iconnav-service',
    path: '/service-dashboard'
  }]
},{
  key: 'serviceManagement',
  title: intl.get('common.serviceManagement'),
  icon: '#iconnav-serverControl',
  children: [{
    key: 'serviceInfo',
    title: intl.get('common.serviceInfo'),
    icon: '#iconnav-serverInfo',
  },{
    key: 'partitionInfo',
    title: intl.get('common.partitionInfo'),
    icon: '#iconnav-partitionInfo',
  },{
    key: 'config',
    title: intl.get('common.config'),
    icon: '#iconnav-configuration',
  },{
    key: 'snapshot',
    title: intl.get('common.snapshot'),
    icon: '#iconnav-snapshot',
  },{
    key: 'longTermTask',
    title: intl.get('common.longTermTask'),
    icon: '#iconnav-timeConsuming',
  }]
}]
export const RoutesList = [
  {
    path: '/machine-dashboard',
    component: MachineDashboard,
    exact: true,
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
];