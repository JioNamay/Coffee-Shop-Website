import React from "react";
import {connect} from "react-redux";

import {archiveOrderAction, deleteOrderAction} from "../store/actions/adminActions";

const OrderHistoryItem = props => {
  const {
    orderItemId,
    itemName,
    itemPrice,
    itemImage,
    dateOrdered,
    deleteOrderAction,
    archiveOrderAction,
    showImage,
    showDelete,
    showArchive
  } = props;

  const adminRemoveOrder = () => {
    deleteOrderAction(orderItemId);
  };

  const onArchiveOrder = () => {
    archiveOrderAction(orderItemId);
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
            adminRemoveOrder()
          }}>Remove From History
          </button>
        </div>
      }
      {
        showArchive &&
        <div className="order-history-options">
          <button onClick={() => {
            onArchiveOrder();
          }}>Archive
          </button>
        </div>
      }
    </div>
  );
};

export default connect(null, {deleteOrderAction, archiveOrderAction})(OrderHistoryItem);
