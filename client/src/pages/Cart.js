import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CartItem from "../components/CartItem";
import { getCartAction } from "../store/actions/shopActions";
import { orderCartAction } from "../store/actions/shopActions";
import {toast} from "react-toastify";

const Cart = (props) => {
  let {
    user,
    cart,
    getCartAction,
    orderCartAction
  } = props;

  useEffect(() => {
    if (user === null) {
      props.history.push('/');
    }

    // Get the cart, if the token has expired make the user go back to login
    getCartAction()
      .then()
      .catch((error) => {
        if (error.message === 'INVALID_LOGIN') {
          props.history.push('/login')
        }
    });
  }, []);

  const onOrderCart = async () => {
    orderCartAction();
    toast.success("Items Ordered", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };

  return (
    <section className="cart-section">
      {
        cart != null && cart.length > 0 &&
        <div>
          <h2>Cart</h2>
          <div className="cart-items">
            {
              cart.map(cartItem =>
                <CartItem
                  key={cartItem.cartItemId}
                  cartItemId={cartItem.cartItemId}
                  itemName={cartItem.name}
                  itemPrice={cartItem.price}
                  itemImage={cartItem.image}
                />
              )
            }
          </div>
          <button id="cart-order-button" onClick={() => {onOrderCart()}}>Order Items</button>
        </div>
      }
      {
        cart != null && cart.length === 0 &&
        <h2>No Items In Cart</h2>
      }
    </section>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    cart: state.shop.cart
  }
};

export default connect(mapStateToProps, { getCartAction, orderCartAction })(Cart);
