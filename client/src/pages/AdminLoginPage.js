import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as EmailValidator from 'email-validator';

import {adminLoginAction} from "../store/actions/adminActions";
import {Link} from "react-router-dom";

const AdminLoginPage = (props) => {
  let {
    adminUser,
    adminLoginAction,
  } = props;

  // redirects to admin if they're already logged in
  useEffect(() => {
    if (adminUser !== null) {
        props.history.push('/admin');
    }
  }, []);

  const [loginError, setLoginError] = useState({
    errorMessage: '',
    errorOccured: false,
    showError: false
  });

  const [loginInfo, setLoginInfo] = useState({
    username: '',
    usernameValid: false,
    usernameTouched: false,
    password: '',
    passwordValid: false,
    passwordTouched: false
  });

  const displayError = () => {
    setTimeout(() => {
      setLoginError({
        ...loginError,
        showError: false
      })
    }, 5000);
  };

  const setUsername = (e) => {
    const username = e.target.value;
    const validUsername = username !== '';
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: username,
      usernameValid: validUsername
    })
  };

  const setPassword = (e) => {
    const password = e.target.value;
    const validPassword = password !== '';
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
      passwordValid: validPassword
    })
  };

  const onBlur = (e) => {
    const blurredField = e.target.name + 'Touched';
    setLoginInfo({
      ...loginInfo,
      [blurredField]: true
    })
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      // Log user in and redirect
      await adminLoginAction(loginInfo.username, loginInfo.password);
      props.history.push('/admin');
    } catch (error) {
      // Show alert on error
      setLoginError({
        ...loginError,
        errorMessage: error.message,
        showError: true
      });
      displayError();
    }
  };

  return (
    <div className="container">
      <div className="login-page">
        <h1 className="login-header">Login</h1>
        {
          loginError.showError &&
          <div className="alert alert-danger" role="alert">
            {loginError.errorMessage}
          </div>
        }
        <form onSubmit={(e) => {
          onLogin(e)
        }}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="text"
              className="form-control"
              name="username"
              required
              value={loginInfo.username}
              onChange={e => {
                setUsername(e)
              }}
              onBlur={e => {
                onBlur(e)
              }}
            />
            {
              loginInfo.usernameTouched && !loginInfo.usernameValid &&
              <small><p className="error-message">Enter a username</p></small>
            }
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              required
              value={loginInfo.password}
              onChange={e => {
                setPassword(e)
              }}
              onBlur={e => {
                onBlur(e)
              }}
            />
            {
              loginInfo.passwordTouched && !loginInfo.passwordValid &&
              <small><p className="error-message">Password required</p></small>
            }
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={
              !loginInfo.usernameValid || !loginInfo.passwordValid
            }
          >Login
          </button>
        </form>
      </div>
    </div>
  )
};

const mapStateToProps = state => {
  return {
    adminUser: state.admin.admin
  }
};

export default connect(mapStateToProps, {adminLoginAction})(AdminLoginPage);
