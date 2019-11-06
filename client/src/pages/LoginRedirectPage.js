import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {tokenLoginAction} from "../store/actions/userActions";

const LoginRedirectPage = (props) => {
  let {
    tokenLoginAction
  } = props;

  useEffect(() => {
    // Get the token
    const link = window.location.href;
    const tokenString = link.substring(link.lastIndexOf('/') + 1);
    const token = tokenString.substring(0, tokenString.length - 1);

    // Store token is local storage
    localStorage.setItem('token', token);
    tokenLoginAction(token)
      .then(() => {
        props.history.push('/browse');
      })
      .catch((error) => {
        // Invalid token, do nothing
      });
  }, []);

  return (
    <div className="">
    </div>
  )
};

export default connect(null, {tokenLoginAction})(LoginRedirectPage);
