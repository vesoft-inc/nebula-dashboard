import { Spin } from 'antd';
import cookies from 'js-cookie';
import React, { Suspense, lazy } from 'react';
import { hot } from 'react-hot-loader/root';
import intl from 'react-intl-universal';
import {
  Route,
  RouteComponentProps,
  BrowserRouter as Router,
  Switch,
  withRouter,
} from 'react-router-dom';
import { INTL_LOCALES } from '@assets/config';
import './App.less';
import { LanguageContext } from '@assets/context';
import { updateQueryStringParameter } from '@assets/utils';
import AuthorizedRoute from './AuthorizedRoute';

const Login = lazy(() => import('@assets/modules/Login'));
const Layouts = lazy(() => import('@assets/modules/Layout/index'));

type IProps = RouteComponentProps;

class App extends React.Component<IProps> {
  currentLocale;
  constructor (props: IProps) {
    super(props);
    const regx = /lang=(\w+)/g;
    const match = regx.exec(props.history.location.search);
    const lang = document.documentElement.getAttribute('lang');

    if (match) {
      cookies.set('locale', match[1] === 'EN_US' ? 'EN_US' : 'ZH_CN');
    } else {
      cookies.set('locale', lang === 'en' ? 'EN_US' : 'ZH_CN');
    }

    this.currentLocale = cookies.get('locale');
  }

  componentDidMount () {
    this.loadIntlLocale();
  }

  loadIntlLocale = () => {
    intl
      .init({
        currentLocale: this.currentLocale || 'zh_CN',
        locales: INTL_LOCALES,
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  toggleLanguage = (locale: string) => {
    cookies.set('locale', locale);
    window.location.href = updateQueryStringParameter(
      window.location.href,
      'lang',
      locale,
    );
  };

  render () {
    return (
      <LanguageContext.Provider
        value={{
          currentLocale: this.currentLocale,
          toggleLanguage: this.toggleLanguage,
        }}
      >
        <Router>
          <Switch>
            <Suspense fallback={<Spin />}>
              <Route path="/Login" component={Login} />
              <AuthorizedRoute path="/" component={Layouts} />
            </Suspense>
          </Switch>
        </Router>
      </LanguageContext.Provider>
      
    );
  }
}

export default withRouter(hot(App));
