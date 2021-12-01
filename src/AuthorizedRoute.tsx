import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import cookies from 'js-cookie';

import { IRootState } from '@/store';

const mapState = (state: IRootState) => ({
  username: state.app.username,
});

const mapDispatch = () => ({});

interface IProps extends RouteComponentProps {
  path: string;
  render?: any;
  component: any;
}

const AuthorizedRoute = (props: IProps) => {
  const { component: Component, render, ...rest } = props;
  if (cookies.get('nu')) {
    return Component ? (
      <Route {...rest} render={props => <Component {...props} />} />
    ) : (
      <Route render={render} {...rest} />
    );
  } else {
    return <Redirect to="/login" {...rest} />;
  }
};


export default connect(mapState, mapDispatch)(withRouter(AuthorizedRoute));
