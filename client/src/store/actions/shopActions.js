import axios from 'axios'
import uuid from "uuid";
import {CartItemData} from "../../models/CartItemData";

export const GET_ITEMS = 'GET_ITEMS';
export const GET_CART = 'GET_CART';
export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const getItemsAction = () => {
  return async dispatch => {
    try {
      const getItemsRequest = await axios.get('/api/shop/all', config);

      dispatch({
        type: GET_ITEMS,
        payload: getItemsRequest.data
      });
    } catch (error) {

    }
  }
};

export const getCartAction = () => {
  return async (dispatch, getState) => {
    try {
      const user = getState().user.user;
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`
        }
      };
      const getCartRequest = await axios.get('/api/shop/cart', tokenConfig);

      dispatch({
        type: GET_CART,
        payload: getCartRequest.data
      })
    } catch (error) {
      throw new Error(error.response.data.errors);
    }
  }
};

export const addCartAction = (itemId, itemName, itemDescription, itemPrice, itemImage) => {
  return async (dispatch, getState) => {
    try {
      // Get state
      const user = getState().user.user;
      const currentCart = [...getState().shop.cart];

      // Add to cart
      const cartItemId = uuid.v4();
      currentCart.push(new CartItemData(cartItemId, itemId, itemName, itemDescription, itemPrice, itemImage));

      // Prepare request to sync with database
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`
        }
      };
      const body = JSON.stringify({cartItemId: cartItemId, itemId: itemId});
      await axios.post('/api/shop/cart', body, tokenConfig);

      dispatch({
        type: ADD_CART_ITEM,
        payload: currentCart
      })
    } catch (error) {

    }
  }
};

export const removeCartAction = (cartItemId) => {
  return async (dispatch, getState) => {
    try {
      // Get state and remove from cart
      const user = getState().user.user;
      const filteredCart = [...getState().shop.cart].filter(cartItem => cartItem.cartItemId !== cartItemId);

      // Prepare request to sync delete with database
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`
        }
      };
      axios.delete(`/api/shop/cart/${cartItemId}`, tokenConfig);

      dispatch({
        type: REMOVE_CART_ITEM,
        payload: filteredCart
      });
    } catch (error) {

    }
  }
};
