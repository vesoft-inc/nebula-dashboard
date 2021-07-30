import React from 'react';
import { Popover } from 'antd';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';
import Icon from '../Icon';

import './index.less';

export const MetricPopover = (props: { list }) => {
  const locale = cookies.get('locale');
  const mannualHref =
    locale === 'ZH_CN'
      ? 'https://docs.nebula-graph.com.cn/master/nebula-dashboard/1.what-is-dashboard/'
      : 'https://docs.nebula-graph.io/master/nebula-dashboard/1.what-is-dashboard/'; 

  return (
    <Popover
      className="dashboard-popover"
      content={
        <div className="popover-metric">
          <div className="metric-content">
            <div className="metric">
              {props.list.map(option => (
                <p key={option.metric}>{option.metric}：</p>
              ))}
            </div>
            <div>
              {props.list.map(option => (
                <p key={option.metric}>
                  {intl.get(`metric_description.${option.metric}`)}
                </p>
              ))}
            </div>
          </div>
          <a href={mannualHref} className="more" target="_blank" rel="noreferrer">
            {intl.get('metric_description.more')}
          </a>
        </div>
      }
    >
      <Icon className="metric-info-icon blue" icon="#iconnav-serverInfo" />
    </Popover>
  );
};
