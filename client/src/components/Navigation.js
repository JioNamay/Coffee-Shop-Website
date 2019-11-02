import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Navigation = (props) => {
  const {
    user
  } = props;

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <Link to="/" className="navbar-brand">Aroma</Link>

        <div>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link to="/browse" className="nav-link">
                Shop
              </Link>
            </li>
            {
              user &&
              <li className="nav-item active">
                <Link to="/cart" className="nav-link">
                  Cart
                </Link>
              </li>
            }
            {
              user &&
              <li className="nav-item active">
                <Link to="/" className="nav-link">
                  Account
                </Link>
              </li>
            }
            {
              !user &&
              <li className="nav-item active">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            }
            {
              !user &&
              <li className="nav-item active">
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </li>
            }
            {
              user &&
              <li className="nav-item active">
                <Link to="/signup" className="nav-link">
                  Log Out
                </Link>
              </li>
            }
          </ul>
        </div>
      </nav>
    </div>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
};

export default connect(mapStateToProps, null)(Navigation);
