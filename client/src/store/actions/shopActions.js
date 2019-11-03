import axios from "axios";
import uuid from "uuid";

import { CartItemData } from "../../models/CartItemData";
import {OrderItemData} from "../../models/OrderItemData";

export const GET_ITEMS = "GET_ITEMS";
export const GET_CART = "GET_CART";
export const ADD_CART_ITEM = "ADD_CART_ITEM";
export const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";

export const ADD_ORDER = 'ADD_ORDER';
export const GET_ORDER_HISTORY = 'GET_ORDERS';
export const REMOVE_ORDER_HISTORY_ITEM = 'REMOVE_ORDER_HISTORY_ITEM';

const config = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const getItemsAction = () => {
  return async dispatch => {
    try {
      const getItemsRequest = await axios.get("/api/shop", config);

      dispatch({
        type: GET_ITEMS,
        payload: getItemsRequest.data
      });
    } catch (error) {}
  };
};

export const getCartAction = () => {
  return async (dispatch, getState) => {
    try {
      const user = getState().user.user;
      const tokenConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`
        }
      };
      const getCartRequest = await axios.get("/api/shop/cart", tokenConfig);

      dispatch({
        type: GET_CART,
        payload: getCartRequest.data
      });
    } catch (error) {
      throw new Error(error.response.data.errors);
    }
  };
};

export const addCartAction = (
  itemId,
  itemName,
  itemDescription,
  itemPrice,
  itemImage
) => {
  return async (dispatch, getState) => {
    try {
      // Get state
      const user = getState().user.user;
      const currentCart = [...getState().shop.cart];

      // Add to cart
      const cartItemId = uuid.v4();
      currentCart.push(
        new CartItemData(
          cartItemId,
          itemId,
          itemName,
          itemDescription,
          itemPrice,
          itemImage
        )
      );

      // Prepare request to sync with database
      const tokenConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`
        }
      };
      const body = JSON.stringify({ cartItemId: cartItemId, itemId: itemId });
      await axios.post("/api/shop/cart", body, tokenConfig);

      dispatch({
        type: ADD_CART_ITEM,
        payload: currentCart
      });

    } catch (error) {

    }
  }
};

export const removeCartAction = cartItemId => {
  return async (dispatch, getState) => {
    try {
      // Get state and remove from cart
      const user = getState().user.user;
      const filteredCart = [...getState().shop.cart].filter(
        cartItem => cartItem.cartItemId !== cartItemId
      );

      // Prepare request to sync delete with database
      const tokenConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`
        }
      };
      axios.delete(`/api/shop/cart/${cartItemId}`, tokenConfig);

      dispatch({
        type: REMOVE_CART_ITEM,
        payload: filteredCart
      });
    } catch (error) {}
  };
};

export const orderCartAction = () => {
  return async (dispatch, getState) => {
    try {
      // Get state and delete everything in the cart
      const user = getState().user.user;
      const cart = getState().shop.cart;
      const newOrders = [];

      // Create order items
      for (const cartItem of cart) {
        const orderItemId = uuid.v4();
        const itemId = cartItem.itemId;
        const date = new Date().toISOString().split('T')[0];
        const name = cartItem.name;
        const description = cartItem.description;
        const price = cartItem.price;
        const image = cartItem.image;
        newOrders.push(new OrderItemData(orderItemId, itemId, date, name, description, price, image));
      }

      // Send a post request to api to sync data with backend
      const tokenConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`
        }
      };
      const body = JSON.stringify({orders: newOrders});
      await axios.post('/api/shop/cart/order', body, tokenConfig);
      dispatch({
        type: ADD_ORDER,
        payload: newOrders
      });
    } catch (error) {
      throw new Error(error.response.data.errors);
    }
  }
};

export const getOrderHistoryAction = () => {
  return async (dispatch, getState) => {
    // Get the user token
    const user = getState().user.user;
    const tokenConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${user.token}`
      }
    };
    const getOrderHistoryRequest = await axios.get('/api/shop/orders', tokenConfig);

    dispatch({
      type: GET_ORDER_HISTORY,
      payload: getOrderHistoryRequest.data
    });
  }
};

export const removeOrderHistoryAction = (orderItemId) => {
  return async dispatch => {

  }
};
