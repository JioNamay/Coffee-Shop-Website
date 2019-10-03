import React from 'react';

const Login = () => {
  return (
    <div>
      <form action="/action_page.php">
        <div className="form-group">
          <label htmlFor="email">Email address:</label>
          <input type="email" className="form-control" id="email" />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password:</label>
          <input type="password" className="form-control" id="pwd" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  )
};

export default Login;
