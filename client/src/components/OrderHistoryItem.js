import React from 'react';
import { connect } from 'react-redux';

import { removeOrderHistoryAction } from "../store/actions/shopActions";
import {deleteOrderAction} from "../store/actions/adminActions";

const OrderHistoryItem = (props) => {
  const {
    orderItemId,
    itemName,
    itemPrice,
    itemImage,
    dateOrdered,
    removeOrderHistoryAction,
    deleteOrderAction,
    showImage,
    showDelete
  } = props;

  const onRemoveOrder = (orderItemId) => {
    removeOrderHistoryAction(orderItemId);
  };

  const adminRemoveOrder = (orderItemId) => {
    deleteOrderAction(orderItemId);
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
      {
        showDelete &&
        <div className="order-history-options">
          <button onClick={() => {adminRemoveOrder(orderItemId)}}>Remove From History</button>
        </div>
      }
      {
        !showDelete &&
        <div className="order-history-options">
          <button onClick={() => {onRemoveOrder(orderItemId)}}>Remove From History</button>
        </div>
      }
    </div>
  )
};

export default connect(null, { removeOrderHistoryAction, deleteOrderAction})(OrderHistoryItem);
