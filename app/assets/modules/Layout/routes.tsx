import { lazy } from 'react';
import intl from 'react-intl-universal';

const MachineDashboard = lazy(() => import('@assets/modules/MachineDashboard'));
const ServiceOverview = lazy(() => import('@assets/modules/ServiceOverview'));

export const MenuList = [{
  key: 'dashboard',
  title: intl.get('common.dashboard'),
  icon: '#iconnav-dashboard',
  children: [{
    key: 'machine',
    title: intl.get('common.machine'),
    icon: '#iconnav-machine',
    path: '/machine-dashboard'
  },{
    key: 'service',
    title: intl.get('common.service'),
    icon: '#iconnav-service',
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
    path: '/service',
    component: ServiceOverview,
    exact: true,
  },
  {
    path: '/machine-dashboard',
    component: MachineDashboard,
    exact: true,
  }
];