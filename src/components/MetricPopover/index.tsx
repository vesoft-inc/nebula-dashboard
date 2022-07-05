import React from 'react';
import { Form, Popover } from 'antd';
import cookies from 'js-cookie';
import intl from 'react-intl-universal';
import Icon from '../Icon';

import styles from './index.module.less';

export const MetricPopover = (props: { list }) => {
  const locale = cookies.get('locale');
  const manualHref =
    locale === 'ZH_CN'
      ? 'https://docs.nebula-graph.com.cn/3.2.0/nebula-dashboard/6.monitor-parameter/'
      : 'https://docs.nebula-graph.io/3.2.0/nebula-dashboard/6.monitor-parameter/'; // TODO update english docs link

  return (
    <Popover
      className={styles.dashboardPopover}
      // trigger="click"
      content={
        <div className={styles.popoverMetric}>
          <div className={styles.metricContent}>
            <Form
              className={styles.metric}
              labelCol={{ span: 13 }}
              wrapperCol={{ span: 11 }}
            >
              {props.list.map(option => {
                if (intl.get(`metric_description.${option.metric}`)) {
                  return (
                    <Form.Item key={option.metric} label={option.metric}>
                      {intl.get(`metric_description.${option.metric}`)}
                    </Form.Item>
                  );
                }
              })}
            </Form>
          </div>
          <a
            href={manualHref}
            className={styles.more}
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
