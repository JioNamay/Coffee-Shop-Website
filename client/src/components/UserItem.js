import React from 'react';
import { connect } from 'react-redux';

const UserItem = (props) => {
  const {
    userId,
    firstName,
    lastName,
    email
  } = props;

  const goToOrders = () => {
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
        <button onClick={() => {console.log('hi')}}>Order History</button>
      </div>
    </div>
  )
};

export default UserItem;
