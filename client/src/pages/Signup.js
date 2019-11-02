import React, { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { connect } from 'react-redux';
import * as EmailValidator from 'email-validator';

import { signupAction } from "../store/actions/userActions";

const Signup = (props) => {
  const [signupError, setSignupError] = useState({
    errorMessage: '',
    errorOccured: false,
    showError: false
  });

  const [signupInfo, setSignupInfo] = useState({
    firstName: '',
    firstNameTouched: false,
    firstNameValid: false,
    lastName: '',
    lastNameValid: false,
    lastNameTouched: false,
    email: '',
    emailValid: false,
    emailTouched: false,
    password: '',
    passwordValid: false,
    passwordTouched: false,
    confirmPassword: '',
    confirmPasswordTouched: false,
    passwordMatches: false
  });

  const displayError = () => {
    setTimeout(() => {
      setSignupError({
        ...signupError,
        showError: false
      })
    }, 5000);
  };

  const setInput = (e) => {
    const name = e.target.value;
    let validFirstName = name !== '';
    let targetValid = e.target.name + 'Valid';
    setSignupInfo({
      ...signupInfo,
      [e.target.name]: e.target.value,
      [targetValid]: validFirstName
    })
  };

  const setEmail = (e) => {
    const email = e.target.value;
    const validEmail = EmailValidator.validate(email);
    setSignupInfo({
      ...signupInfo,
      [e.target.name]: email,
      emailValid: validEmail
    });
  };

  const setConfirmPassword = (e) => {
    const confirmPass = e.target.value;
    let passwordMatch = confirmPass === signupInfo.password;
    setSignupInfo({
      ...signupInfo,
      confirmPassword: confirmPass,
      passwordMatches: passwordMatch
    });
  };

  const onBlur = (e) => {
    const blurredField = e.target.name + 'Touched';
    setSignupInfo({
      ...signupInfo,
      [blurredField]: true
    })
  };

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      // Sign the user up and then redirect them
      await props.signupAction(signupInfo.firstName, signupInfo.lastName, signupInfo.email, signupInfo.password);
      props.history.push('/login');
    } catch (error) {
      // Show alert on error
      setSignupError({
        ...signupError,
        errorMessage: error.message,
        showError: true
      });
      displayError();
    }
  };

  return (
    <div className="container">
      <div className="signup-page">
        <h1 className="signup-header">Sign Up</h1>
        {
          signupError.showError &&
          <div className="alert alert-danger" role="alert">
            {signupError.errorMessage}
          </div>
        }
        <form onSubmit={(e) => {onSignup(e)}}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name='firstName'
              required
              value={signupInfo.firstName}
              onChange={e => setInput(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              signupInfo.firstNameTouched && !signupInfo.firstNameValid &&
              <small><p className="error-message">First name must not be empty</p></small>
            }
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name='lastName'
              required
              value={signupInfo.lastName}
              onChange={e => setInput(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              signupInfo.lastNameTouched && !signupInfo.lastNameValid &&
              <small><p className="error-message">Last name must not be empty</p></small>
            }
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              name='email'
              required
              value={signupInfo.email}
              onChange={e => setEmail(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              signupInfo.emailTouched && !signupInfo.emailValid &&
              <small><p className='error-message'>Enter a valid email</p></small>
            }
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              required
              minLength={5}
              value={signupInfo.password}
              onChange={e => setInput(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              signupInfo.passwordTouched && !signupInfo.passwordValid &&
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
              value={signupInfo.confirmPassword}
              onChange={e => setConfirmPassword(e)}
              onBlur={(e) => {onBlur(e)}}
            />
            {
              signupInfo.confirmPasswordTouched && signupInfo.password !== '' && !signupInfo.passwordMatches &&
              <small><p className='error-message'>Passwords do not match</p></small>
            }
          </div>
          <PasswordStrengthBar password={signupInfo.password} />
          <button
            type="submit"
            className="signup-button"
            disabled={
              !signupInfo.firstNameValid || !signupInfo.lastNameValid ||
              !signupInfo.emailValid || !signupInfo.passwordValid || !signupInfo.passwordMatches
            }
          >Sign Up</button>
        </form>
      </div>
    </div>
  )
};

export default connect(null, { signupAction })(Signup);
