import React, { useState } from 'react';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';
import { doResetAction } from "../store/actions/userActions";

const VerifyReset = (props) => {
  const {
    doResetAction
  } = props;

  const [passwordInfo, setPasswordInfo] = useState({
    password: '',
    passwordValid: false,
    passwordTouched: false,
    confirmPassword: '',
    confirmPasswordTouched: false,
    passwordMatches: false
  });

  const setPassword = (e) => {
    const password = e.target.value;
    let validPassword = password !== '' && password.length >= 5;
    let targetValid = e.target.name + 'Valid';
    setPasswordInfo({
      ...passwordInfo,
      [e.target.name]: e.target.value,
      [targetValid]: validPassword
    })
  };

  const setConfirmPassword = (e) => {
    const confirmPass = e.target.value;
    let passwordMatch = confirmPass === passwordInfo.password;
    setPasswordInfo({
      ...passwordInfo,
      confirmPassword: confirmPass,
      passwordMatches: passwordMatch
    });
  };

  const onBlur = (e) => {
    const blurredField = e.target.name + 'Touched';
    setPasswordInfo({
      ...passwordInfo,
      [blurredField]: true
    })
  };

  const onPasswordReset = (e) => {
    e.preventDefault();
    const link = window.location.href;
    const token = link.substring(link.lastIndexOf('/') + 1);
    doResetAction(token, passwordInfo.password)
      .then(() => {
        props.history.push('/login');
      })
      .catch((error) => {
        toast.error("The reset link is invalid or has expired, try ask for a password reset again", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 10000
        });
      });
  };

  return (
    <div className="container">
      <section className="verify-reset-section">
        <h2 className="reset-password-header">New Password</h2>
        <form onSubmit={(e) => {onPasswordReset(e)}}>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              required
              minLength={5}
              value={passwordInfo.password}
              onChange={e => setPassword(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              passwordInfo.passwordTouched && !passwordInfo.passwordValid &&
              <small><p className='error-message'>Password must be at least 5 characters</p></small>
            }
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              required
              value={passwordInfo.confirmPassword}
              onChange={e => setConfirmPassword(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              passwordInfo.confirmPasswordTouched && passwordInfo.password !== '' && !passwordInfo.passwordMatches &&
              <small><p className='error-message'>Passwords do not match</p></small>
            }
          </div>
          <button
            type="submit"
            className="reset-password-button"
            disabled={
              !passwordInfo.passwordMatches || !passwordInfo.passwordValid
            }
          >Confirm</button>
        </form>
      </section>
    </div>
  )
};

export default connect(null, { doResetAction })(VerifyReset);
