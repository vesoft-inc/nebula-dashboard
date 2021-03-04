import { PageHeader, Select } from 'antd';
import React from 'react';
import Icon from '@assets/components/Icon';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import './index.less';
const { Option } = Select;

interface IProps extends RouteComponentProps {
  config: {
    breadcrumb: {
      path: string,
      breadcrumbName: string
    }[],
    title: string,
    showBackBtn?: boolean,
    extra?: any
  }
};
interface IState {
  collapsed: boolean;
}

class Header extends React.PureComponent<IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  handleClick = (value) => {
    this.props.history.push(value);
  }

  handleBack = () => {
    const { breadcrumb } = this.props.config;
    const path = breadcrumb[breadcrumb.length - 2].path;
    this.props.history.push(path);
  }

  render () {
    const { breadcrumb: routes, title, showBackBtn, extra } = this.props.config;
    const itemRender = (route, _params, routes, _paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
      );
    };
    const currentPage = extra ? extra.filter(item => item.value === this.props.location.pathname) : null;
    return (
      <PageHeader
        className="page-header"
        title={<>
          {showBackBtn && <Icon className="btn-return blue" icon="#iconreturn" onClick={this.handleBack} />}
          <span>{title}</span>
        </>}
        breadcrumb={{ itemRender, routes }}
        extra={extra ? <div className="view-info">
          <span>查看信息:</span>
          <Select defaultValue={currentPage[0].value} style={{ width: 120 }} onChange={this.handleClick}>
            {extra.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)}
          </Select>
        </div> : null}
      />
    );
  }
}

export default withRouter(Header);
