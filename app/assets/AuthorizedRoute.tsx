import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import { IRootState } from './store';

const mapState = (state: IRootState) => ({
  username: state.app.username,
  password: state.app.password,
});

const mapDispatch = () => ({});

const AuthorizedRoute = ({ component: Component, render, ...rest }) => {
  console.log('rest', rest);
  if (rest.username && rest.password) {
    return Component ? (
      <Route {...rest} render={props => <Component {...props} />} />
    ) : (
      <Route render={render} {...rest} />
    );
  } else {
    return <Redirect to="/login" {...rest} />;
  }
};


export default connect(mapState, mapDispatch)(AuthorizedRoute);
