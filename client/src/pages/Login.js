import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as EmailValidator from 'email-validator';

import { loginAction } from "../store/actions/userActions";
import { tokenLoginAction } from "../store/actions/userActions";
import {Link} from "react-router-dom";

const Login = (props) => {
  let {
    user,
    loginAction,
    tokenLoginAction,
  } = props;

  useEffect(() => {
    const tokenAvailable = localStorage.getItem('token');
    if (tokenAvailable !== null) {
      // Attempt to login with token
      tokenLoginAction(tokenAvailable)
        .then(() => {
          props.history.push('/browse');
        })
        .catch((error) => {
          // Invalid token, do nothing
        });
    }
  }, []);

  if (user !== null && user.token !== null) {
    localStorage.setItem('token', user.token);
  }

  const [loginError, setLoginError] = useState({
    errorMessage: '',
    errorOccured: false,
    showError: false
  });

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    emailValid: false,
    emailTouched: false,
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

  const setEmail = (e) => {
    const email = e.target.value;
    const validEmail = EmailValidator.validate(email);
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: email,
      emailValid: validEmail
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
      await loginAction(loginInfo.email, loginInfo.password);
      props.history.push('/browse');
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
        <form onSubmit={(e) => {onLogin(e)}}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              required
              value={loginInfo.email}
              onChange={e => {setEmail(e)}}
              onBlur={e => {onBlur(e)}}
            />
            {
              loginInfo.emailTouched && !loginInfo.emailValid &&
              <small><p className="error-message">Enter a valid email</p></small>
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
              onChange={e => {setPassword(e)}}
              onBlur={e => {onBlur(e)}}
            />
            {
              loginInfo.passwordTouched && !loginInfo.passwordValid &&
              <small><p className="error-message">Password required</p></small>
            }
          </div>
          <Link to="/login/identify" className="nav-link identify-link">
            <p>Forgot your password?</p>
          </Link>
          <button
            type="submit"
            className="login-button"
            disabled={
              !loginInfo.emailValid || !loginInfo.passwordValid
            }
          >Login</button>

          <div className="signup-link-container">
            <Link to="/signup" className="nav-link">
              <p>Don't have an account? Sign up now</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
};

export default connect(mapStateToProps, { loginAction, tokenLoginAction })(Login);
