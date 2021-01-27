import { lazy } from 'react';
import intl from 'react-intl-universal';

const Test = lazy(() => import('@assets/modules/Test'));
const MachineDashboard = lazy(() => import('@assets/modules/MachineDashboard'));

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
    icon: '#iconnav-srevise',
  }]
},{
  key: 'serviceManagement',
  title: intl.get('common.serviceManagement'),
  icon: '#iconnav-sreverControl',
  children: [{
    key: 'serviceInfo',
    title: intl.get('common.serviceInfo'),
    icon: '#iconnav-sreverInfo',
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
    path: '/test',
    component: Test,
    exact: true,
  },
  {
    path: '/machine-dashboard',
    component: MachineDashboard,
    exact: true,
  }
];