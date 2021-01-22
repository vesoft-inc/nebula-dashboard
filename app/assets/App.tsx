import loadable from '@loadable/component';
import { Layout } from 'antd';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';

import './App.less';

const Test = loadable(() => import('#assets/modules/Test'));

const { Header, Content } = Layout;

type IProps = RouteComponentProps;

class App extends React.Component<IProps> {
  render() {
    return (
      <Router>
        <Layout className="nebula-test-stat">
          <Header />
          <Content>
            <Switch>
              <Route path="/test" component={Test} />
              <Redirect to="/test" />
            </Switch>
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default withRouter(hot(App));
