import React, { useState } from 'react';
import * as EmailValidator from 'email-validator';
import { toast } from "react-toastify";
import { connect } from 'react-redux';

import { resetPasswordAction } from "../store/actions/userActions";

const Identify = (props) => {
  const {
    resetPasswordAction
  } = props;

  const [emailInfo, setEmailInfo] = useState({
    email: '',
    emailValid: false
  });

  const setEmail = (e) => {
    const email = e.target.value;
    const validEmail = EmailValidator.validate(email);
    setEmailInfo({
      ...setEmailInfo,
      [e.target.name]: email,
      emailValid: validEmail
    })
  };

  const onResetSubmit = (e) => {
    e.preventDefault();
    resetPasswordAction(emailInfo.email);
    toast.success("An Email Will Be Sent To You", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
  };

  return (
    <div className="container">
      <section className="identify-section">
        <h2 className="reset-header">Reset Password</h2>
        <form onSubmit={(e) => {onResetSubmit(e)}}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              required
              value={emailInfo.email}
              onChange={e => {setEmail(e)}}
            />
          </div>
          <button
            type="submit"
            className="reset-button"
            disabled={
              !emailInfo.emailValid
            }
          >Reset Password</button>
        </form>
      </section>
    </div>
  )
};

export default connect(null, { resetPasswordAction })(Identify);
