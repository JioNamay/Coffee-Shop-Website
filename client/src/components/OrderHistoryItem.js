import React from "react";
import {connect} from "react-redux";

import {removeOrderHistoryAction} from "../store/actions/shopActions";
import {deleteOrderAction} from "../store/actions/adminActions";
import {archiveOrderHistoryAction} from "../store/actions/shopActions";

const OrderHistoryItem = props => {
  const {
    orderItemId,
    itemName,
    itemPrice,
    itemImage,
    dateOrdered,
    deleteOrderAction,
    showImage,
    showDelete,
    showArchive
  } = props;

  const adminRemoveOrder = (orderItemId) => {
    deleteOrderAction(orderItemId);
  };

  const onArchiveOrder = orderItemId => {
    archiveOrderHistoryAction(orderItemId);
  };

  return (
    <div className="order-history-card">
      {showImage && (
        <div className="order-history-image">
          <img src={itemImage} alt={itemName}/>
        </div>
      )}
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
          <button onClick={() => {
            adminRemoveOrder(orderItemId)
          }}>Remove From History
          </button>
        </div>
      }
      {
        showArchive &&
        <div className="order-history-options">
          <button onClick={() => {
            onArchiveOrder(orderItemId);
          }}>Archive
          </button>
        </div>
      }
    </div>
  );
};

export default connect(null, {removeOrderHistoryAction, deleteOrderAction})(OrderHistoryItem);
