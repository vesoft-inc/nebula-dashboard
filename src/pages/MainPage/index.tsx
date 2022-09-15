import React from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import cookies from 'js-cookie';
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import { MenuList, RoutesList } from './routes';
import Header from './Header';
import nebulaLogo from '@/static/images/nebula_logo.png';
import Icon from '@/components/Icon';
import LanguageSelect from '@/components/LanguageSelect';
import { METRIC_PROCESS_TYPES } from '@/utils/metric';
import { trackPageView } from '@/utils/stat';
import { IDispatch, IRootState } from '@/store';
import './index.less';
import { LanguageContext } from '@/context';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncLogout: dispatch.app.asyncLogout,
  asyncGetAppInfo: dispatch.app.asyncGetAppInfo,
  asyncGetCustomConfig: dispatch.app.asyncGetCustomConfig,
  asyncGetServiceMetric: dispatch.serviceMetric.asyncGetServiceMetric,
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces
});

const mapState = (state: IRootState) => ({
  appVersion: state.app.version,
  nebluaVersion: state.nebula.version,
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps { }

interface IState {
  collapsed: boolean;
}

const clusterInfoList = [
  'version-statistics',
  'leader-distribution',
  'partition-distribution',
  'service-info',
  'partition-info',
  'long-term-task'
]

class MainPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    const { appVersion, nebluaVersion } = this.props;
    this.props.asyncGetCustomConfig();
    if (appVersion === '') {
      this.props.asyncGetAppInfo();
    }
    if (nebluaVersion) {
      this.props.asyncGetSpaces();
      METRIC_PROCESS_TYPES.map(item =>
        this.props.asyncGetServiceMetric({
          componentType: item,
          version: nebluaVersion,
        }),
      );
    }
  }

  renderMenu = list => {
    if (list && list.length > 0) {
      return list.map(item => {
        if (item.children && item.children.length > 0) {
          return (
            <SubMenu
              key={item.key}
              icon={<Icon className="menu-icon anticon" icon={item.icon} />}
              title={item.title}
            >
              {this.renderMenu(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item
            key={item.key}
            icon={<Icon className="menu-icon" icon={item.icon} />}
            title={item.title}
          >
            <Link to={item.path || '/'}>{item.title}</Link>
          </Menu.Item>
        );
      });
    }
  };

  toggleMenu = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  render() {
    const { collapsed } = this.state;
    const { appVersion } = this.props;
    const [, activeOpenSubMenu, activeMenu] =
      this.props.location.pathname.split('/');
      debugger;
    let activeKey =
      activeMenu === 'overview'
        ? `${activeOpenSubMenu}-${activeMenu}`
        : activeMenu;
    const locale = cookies.get('locale');
    const manualHref =
      locale === 'ZH_CN'
        ? 'https://docs.nebula-graph.com.cn/3.2.0/nebula-dashboard/1.what-is-dashboard/'
        : 'https://docs.nebula-graph.io/3.2.0/nebula-dashboard/1.what-is-dashboard/';

    if (activeKey === undefined) {
      activeKey = 'machine-overview';
    }
    if (clusterInfoList.includes(activeKey)) {
      activeKey = 'service-manage';
    }
    return (
      <Layout className="nebula-stat">
        <Sider
          className="nebula-sider"
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          collapsedWidth={56}
        >
          <div className="sidebar-header">
            <img src={nebulaLogo} className="logo" />
            {!collapsed && <p className="title">Nebula Dashboard</p>}
          </div>
          <Menu
            className="sidebar-menu"
            theme="dark"
            mode="inline"
            inlineIndent={20}
            onClick={item => () => trackPageView(item.key)}
            defaultOpenKeys={MenuList.map(item => item.key)}
            selectedKeys={[activeKey]}
          >
            {this.renderMenu(MenuList)}
          </Menu>
          <div className="sidebar-footer">
            <div className="btn-logout" onClick={this.props.asyncLogout}>
              <Icon className="menu-btn" icon="#iconnav-logout" />
              {!collapsed && (
                <span className="text-logout">{intl.get('common.logout')}</span>
              )}
            </div>
            <LanguageContext.Consumer>
              {({ currentLocale, toggleLanguage }) => (
                <LanguageSelect
                  mode="dark"
                  showIcon={!collapsed}
                  currentLocale={currentLocale}
                  toggleLanguage={toggleLanguage}
                />
              )}
            </LanguageContext.Consumer>
            <div className="row">
              {!collapsed && <span className="version">v {appVersion}</span>}
              {!collapsed && (
                <Dropdown
                  placement="topCenter"
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a target="_blank" href={manualHref} rel="noreferrer">
                          {intl.get('common.manual')}
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          target="_blank"
                          href={intl.get('common.forumLink')}
                          rel="noreferrer"
                        >
                          {intl.get('common.forum')}
                        </a>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <span className="help">{intl.get('common.help')}</span>
                </Dropdown>
              )}
              <div className="btn-collapse" onClick={this.toggleMenu}>
                {!collapsed && (
                  <Icon className="menu-collapse-icon" icon="#iconnav-fold" />
                )}
                {collapsed && (
                  <Icon className="menu-collapse-icon" icon="#iconnav-unfold" />
                )}
              </div>
            </div>
          </div>
        </Sider>
        <Layout className="page-content">
          <Switch>
            {
              RoutesList.map(route => (
                <Route
                  path={route.path}
                  render={
                    () => (
                      <>
                        <Header config={route.headerConfig} />
                        <Content className="main-content">
                          <Route component={route.component} />
                        </Content>
                      </>
                    )
                  }
                  key={route.path} exact={route.exact} />
              ))
            }
            <Redirect from="/*" to="/machine/overview" />
          </Switch>
        </Layout>
      </Layout>
    );
  }
}

export default connect(mapState, mapDispatch)(withRouter(MainPage));
