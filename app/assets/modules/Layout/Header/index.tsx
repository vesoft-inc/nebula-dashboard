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

class Layouts extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false
    }
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
    return (
      <PageHeader
        className="page-header"
        title="Title"
        breadcrumb={{ itemRender, routes }}
        extra={<div className="view-info">
          <span>查看信息:</span>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>}
      />
    );
  }
}

export default withRouter(Layouts);
