import { PageHeader, Radio } from 'antd';
import React from 'react';
import Icon from '@/components/Icon';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { trackPageView } from '@/utils/stat';
import './index.less';

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
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  handlePageView = (e) => {
    trackPageView(e.target.value);
    this.props.history.push(e.target.value);
  }

  handleBack = () => {
    const { breadcrumb } = this.props.config;
    const path = breadcrumb[breadcrumb.length - 2].path;
    this.props.history.push(path);
  }

  render() {
    const { breadcrumb: routes, title, showBackBtn, extra } = this.props.config;
    const itemRender = (route, _params, routes, _paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
      );
    };
    const { pathname } = this.props.location;
    const currentPage = extra ? extra.filter(item => item.value === pathname) : null;
    return (
      <PageHeader
        className="page-header"
        title={<>
          {showBackBtn && <Icon className="btn-return blue" icon="#iconreturn" onClick={this.handleBack} />}
          <span>{title}</span>
        </>}
        breadcrumb={{ itemRender, routes }}
        extra={extra && currentPage.length !== 0 ? <Radio.Group
          options={extra}
          onChange={this.handlePageView}
          value={currentPage[0].value}
          optionType="button"
          buttonStyle="solid"
        /> : null}
      />
    );
  }
}

export default withRouter(Header);
