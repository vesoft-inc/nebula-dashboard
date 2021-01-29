import { PageHeader, Select } from 'antd';
import React from 'react';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import './index.less'
const { Option } = Select;

type IProps = RouteComponentProps;
interface IState {
  collapsed: boolean;
}

class Layouts extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  handleClick = (value) => {
    this.props.history.push(value);
  }

  render() {
    const routes = [
      {
        path: '/index',
        breadcrumbName: 'First-level Menu',
      },
      {
        path: '/first',
        breadcrumbName: 'Second-level Menu',
      },
      {
        path: '/second',
        breadcrumbName: 'Third-level Menu',
      },
    ];
    const itemRender = (route, _params, routes, _paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
      );
    }
    const SelectOptions = [{
      label: '服务概况',
      value: '/service-dashboard'
    },{
      label: '服务指标详情',
      value: '/service-dashboard/server-metrics'
    },{
      label: '版本详情',
      value: '/service-dashboard/version-statistics'
    },{
      label: 'Leader分布',
      value: '/service-dashboard/leader-distribution'
    },{
      label: 'Partition分布',
      value: '/service-dashboard/partition-distribution'
    },]
    return (
      <PageHeader
        className="page-header"
        title="Title"
        breadcrumb={{ itemRender, routes }}
        extra={<div className="view-info">
          <span>查看信息:</span>
          <Select defaultValue="服务概况" style={{ width: 120 }} onChange={this.handleClick}>
            {SelectOptions.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)}
          </Select>
        </div>}
      />
    );
  }
}

export default withRouter(Layouts);
