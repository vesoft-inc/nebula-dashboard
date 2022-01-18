import React from 'react';
import { Select as AntSelect, SelectProps } from 'antd';
import Icon from '../Icon';
import './index.less';

export const DashboardSelect = (props: SelectProps<any>) => (
  <AntSelect
    suffixIcon={<Icon className="select-icon" icon="#iconnav-foldTriangle" />}
    className="dashboard-select"
    {...props}
  />
);

export const { Option } = AntSelect;
