import React from 'react';
import { connect } from 'react-redux';

import { removeOrderHistoryAction } from "../store/actions/shopActions";

const OrderHistoryItem = (props) => {
  const {
    orderItemId,
    itemName,
    itemPrice,
    itemImage,
    dateOrdered,
    removeOrderHistoryAction,
    showImage,
    showDelete
  } = props;

  const onRemoveOrder = (orderItemId) => {
    removeOrderHistoryAction(orderItemId);
  };

  return (
    <div className="order-history-card">
      {
        showImage &&
        <div className="order-history-image">
          <img src={itemImage} alt={itemName} />
        </div>
      }
      <div className="order-history-name">
        <p>{itemName}</p>
      </div>
      <div className="order-history-price">
        <p>${itemPrice}</p>
        <div className="order-history-date">
          <p>Date Ordered</p>
          <p>{dateOrdered}</p>
        </div>
      </div>
      <div className="order-history-options">
        <button onClick={() => {onRemoveOrder(orderItemId)}}>Remove From History</button>
      </div>
    </div>
  )
};

export default connect(null, { removeOrderHistoryAction })(OrderHistoryItem);
