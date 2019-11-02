import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CartItem from "../components/CartItem";
import { getCartAction } from "../store/actions/shopActions";

const Cart = (props) => {
  let {
    user,
    cart,
    getCartAction
  } = props;

  useEffect(() => {
    if (user === null) {
      props.history.push('/');
    }

    // Get the cart, if the token has expired make the user go back to login
    getCartAction()
      .then()
      .catch((error) => {
        props.history.push('/login');
    });
  }, []);

  return (
    <section className="cart-section">
      {
        cart != null && cart.length > 0 &&
        <h2>Cart</h2>
      }
      {
        cart != null && cart.length > 0 && cart.map(cartItem =>
          <CartItem
            key={cartItem.cartItemId}
            cartItemId={cartItem.cartItemId}
            itemName={cartItem.name}
            itemPrice={cartItem.price}
            itemImage={cartItem.image}
          />
        )
      }
      {
        cart != null && cart.length === 0 &&
        <h4>No Items In Cart</h4>
      }
      {
        cart != null && cart.length > 0 &&
        <button>Order Items</button>
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

export default connect(mapStateToProps, { getCartAction })(Cart);
