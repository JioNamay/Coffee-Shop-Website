import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {userLogoutAction} from "../store/actions/userActions";
import {shopLogoutAction} from "../store/actions/shopActions";

const Logout = (props) => {
  let {
    user,
    userLogoutAction,
    shopLogoutAction
  } = props;

  useEffect(() => {
    if (user !== null) {
      // Do logout
      userLogoutAction();
      shopLogoutAction();

      // Get rid of token
      localStorage.removeItem('token');

      props.history.push('/login');
    }
  });

  return (
    <section className="logout">
    </section>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
};

export default connect(mapStateToProps, { userLogoutAction, shopLogoutAction })(Logout);
