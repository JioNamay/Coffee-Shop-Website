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
      <h3>{itemName}</h3>
      <div className="cart-card-image">
        <img src={itemImage} alt={itemName}/>
      </div>
      <p>{itemPrice}</p>
      <button onClick={() => {onCartRemove(cartItemId)}}>Remove from Cart</button>
    </div>
  )
};

export default connect(null, { removeCartAction })(CartItem);
