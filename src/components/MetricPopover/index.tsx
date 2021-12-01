import React from 'react';
import { Popover } from 'antd';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';
import Icon from '../Icon';

import './index.less';

export const MetricPopover = (props: { list }) => {
  const locale = cookies.get('locale');
  const manualHref =
    locale === 'ZH_CN'
      ? 'https://docs.nebula-graph.com.cn/2.5.0/nebula-dashboard/6.monitor-parameter/'
      : 'https://docs.nebula-graph.io/2.5.0/nebula-dashboard/6.monitor-parameter/'; // TODO update english docs link

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
          <a
            href={manualHref}
            className="more"
            target="_blank"
            rel="noreferrer"
          >
            {intl.get('metric_description.more')}
          </a>
        </div>
      }
    >
      <Icon className="metric-info-icon blue" icon="#iconnav-serverInfo" />
    </Popover>
  );
};
