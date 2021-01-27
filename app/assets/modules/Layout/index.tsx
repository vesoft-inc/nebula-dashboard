import { Layout, Menu } from 'antd';
import React from 'react';
import nebulaLogo from '@assets/static/images/nebula_logo.png'
import Icon from '@assets/components/Icon'
import LanguageSelect from '@assets/components/LanguageSelect'
import intl from 'react-intl-universal';
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import { MenuList, RoutesList } from './routes'
import './index.less'
import Header from './Header'
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

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
  renderMenu = (list) => {
    if(list && list.length > 0) {
      return list.map(item => {
        if(item.children && item.children.length > 0) {
          return (<SubMenu key={item.key} icon={<Icon className="menu-icon anticon" icon={item.icon} />} title={item.title}>
            {this.renderMenu(item.children)}
          </SubMenu>)
        }
        return (<Menu.Item key={item.key} icon={<Icon className="menu-icon" icon={item.icon} />} title={item.title}>
          <Link to={item.path || '/'}>{item.title}</Link>
        </Menu.Item>)
      })
    }
  }

  toggleMenu = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    })
  }

  render() {
    const { collapsed } = this.state;
    return (
      <Layout className="nebula-stat">
        <Sider className="nebula-sider" trigger={null} 
          collapsible={true} 
          collapsed={collapsed}
          collapsedWidth={56}
        >
          <div className="sidebar-header">
            <img src={nebulaLogo} className="logo" />
            {!collapsed && <p className="title">Nebula Dashboard</p>}
          </div>
          <Menu className="sidebar-menu" 
            theme="dark"
            mode="inline" 
            inlineIndent={20}
            defaultOpenKeys={['dashboard']}
            defaultSelectedKeys={['machine']}>
            {this.renderMenu(MenuList)}
          </Menu>
          <div className="sidebar-footer">
            <div className="btn-logout">
              <Icon className="menu-btn" icon="#iconnav-logout" />
              {!collapsed && <span className="text-logout">{intl.get('common.logout')}</span>}
            </div>
            <LanguageSelect mode="dark" showIcon={!collapsed} />
            <div className="row">
              {!collapsed && <span className="version">v1.1.0</span>}
              <div className="btn-collapse" onClick={this.toggleMenu}>
                {!collapsed && <Icon className="menu-collapse-icon" icon="#iconnav-fold" />}
                {collapsed && <Icon className="menu-collapse-icon" icon="#iconnav-unfold" />}
              </div>
            </div>
          </div>
        </Sider>
        <Layout>
          <Header />
          <Content className="page-content">
            <Switch>
              {RoutesList.map(route => <Route path={route.path} component={route.component} key={route.path} />)}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Layouts);
