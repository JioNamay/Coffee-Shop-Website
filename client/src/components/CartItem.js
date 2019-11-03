import React from 'react';
import { connect } from 'react-redux';

import { removeCartAction } from "../store/actions/shopActions";

const CartItem = (props) => {
  const {
    cartItemId,
    itemName,
    itemPrice,
    itemImage,
    removeCartAction
  } = props;

  const onCartRemove = (cartItemId) => {
    removeCartAction(cartItemId);
  };

  return (
    <div className="cart-card">
      <div className="cart-card-image">
        <img src={itemImage} alt={itemName} />
      </div>
      <div className="cart-card-name">
        <p>{itemName}</p>
      </div>
      <div className="cart-card-price">
        <p>${itemPrice}</p>
      </div>
      <div className="cart-card-options">
        <button onClick={() => {onCartRemove(cartItemId)}}>&#10006;</button>
      </div>
    </div>
  )
};

export default connect(null, { removeCartAction })(CartItem);
