import React, {Fragment, useState} from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';

const Signup = () => {
  const [password, changePassword] = useState('');

  const onChange = (e) => {
    changePassword(e.target.value);
  };

  return (
    <Fragment>
      <div>
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={password} onChange={e => onChange(e)} />
            <PasswordStrengthBar password={password} />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </Fragment>
  )
};

export default Signup;
