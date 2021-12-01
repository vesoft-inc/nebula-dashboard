import React from 'react';
import Icon from '@/components/Icon';
import intl from 'react-intl-universal';
import { IServicePanelConfig, IStatRangeItem } from '@/utils/interface';
import { getDataByType } from '@/utils/dashboard';
import { SERVICE_DEFAULT_RANGE, SERVICE_POLLING_INTERVAL } from '@/utils/service';
import Card from '@/components/Service/ServiceCard/Card';
import { IDispatch, IRootState } from '@/store';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { Popover } from 'antd';

import './index.less';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetMetricsData: dispatch.service.asyncGetMetricsData,
  };
};

const mapState = (state: IRootState) => {
  return {
    aliasConfig: state.app.aliasConfig,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  onConfigPanel: () => void;
  config: IServicePanelConfig;
  aliasConfig: any;
}

interface IState {
  data: IStatRangeItem[],
}
class CustomServiceQueryPanel extends React.Component<IProps, IState> {
  pollingTimer: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.pollingData();
  }

  componentWillUnmount() {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  componentDidUpdate( prevProps) {
    if(!isEqual(prevProps.config, this.props.config)) {
      this.resetPollingData();
    }
  }

  resetPollingData = () => {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
    this.pollingData();
  }

  getMetricsData = async () => {
    const { config } = this.props;
    const { period: metricPeriod, metricFunction } = config;
    const end = Date.now();
    const data = await this.props.asyncGetMetricsData({
      query: metricFunction + metricPeriod, // EXPLAIN: query like nebula_graphd_num_queries_rate_600
      start: end - SERVICE_DEFAULT_RANGE,
      end
    });
    this.setState({
      data
    });
  }

  pollingData = () => {
    this.getMetricsData();
    this.pollingTimer = setTimeout(this.pollingData, SERVICE_POLLING_INTERVAL);
  }

  render() {
    const { data } = this.state;
    const { config: { metric, period, metricType, baseLine }, aliasConfig } = this.props;
    return <div className="service-card">
      <div className="header">
        <Popover placement="bottomLeft" content={intl.get(`metric_description.${metric}`)}>{metric}</Popover>
        <div>
          <span>{intl.get('service.period')}: <span>{period}</span></span> 
          <span>{intl.get('service.metricParams')}: <span>{metricType}</span></span>
          <div className="btn-icon-with-desc blue" onClick={this.props.onConfigPanel} >
            <Icon icon="#iconSetup" />
            <span>{intl.get('common.set')}</span>
          </div>
        </div>
      </div>
      <div className="content">
        {data.length > 0 && <Card baseLine={baseLine} data={getDataByType({ data, type:'all', name:'instanceName', aliasConfig })} loading={false}/>}
      </div>
    </div>;
  }
}

export default connect(mapState, mapDispatch)(CustomServiceQueryPanel);