import React from 'react';
import {Link} from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <Link to="/" className="navbar-brand">Shopping</Link>

        <div>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  )
};

export default Navigation;
