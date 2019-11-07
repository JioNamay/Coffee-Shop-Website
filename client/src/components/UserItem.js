import React from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";

const UserItem = (props) => {
  const {
    userId,
    firstName,
    lastName,
    email
  } = props;

  const redirectToOrders = () => {
    props.history.push("/admin/orders/" + userId);
  };

  return (
    <div className="user-card">
      <div className="user-name">
        <p>{firstName} {lastName}</p>
      </div>
      <div className="user-email">
        <p>{email}</p>
      </div>
      <div className="order-history-options">
        <Link to={`/admin/orders/${userId}`} className="order-history-link">
          Order History
        </Link>
      </div>
    </div>
  )
};

export default UserItem;
