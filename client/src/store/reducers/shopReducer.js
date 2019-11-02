import {ADD_CART_ITEM, GET_CART, GET_ITEMS, REMOVE_CART_ITEM} from "../actions/shopActions";
import {Item} from "../../models/Item";
import {CartItemData} from "../../models/CartItemData";

const initialState = {
  items: null,
  cart: []
};

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ITEMS:
      const items = [];
      const itemsRes = action.payload.items;
      for (const item in itemsRes) {
        if (itemsRes.hasOwnProperty(item)) {
          const itemId = itemsRes[item].itemid;
          const name = itemsRes[item].name;
          const description = itemsRes[item].description;
          const price = itemsRes[item].price;
          const image = itemsRes[item].image;

          items.push(new Item(itemId, name, description, price, image));
        }
      }
      return {
        ...state,
        items: items
      };
    case GET_CART:
      const cartItems = [];
      const cartRes = action.payload.cart;
      for (const cartItem in cartRes) {
        if (cartRes.hasOwnProperty(cartItem)) {
          const cartItemId = cartRes[cartItem].cartitemid;
          const itemId = cartRes[cartItem].itemid;
          const name = cartRes[cartItem].name;
          const description = cartRes[cartItem].description;
          const price = cartRes[cartItem].price;
          const image = cartRes[cartItem].image;
          cartItems.push(new CartItemData(cartItemId, itemId, name, description, price, image));
        }
      }
      return {
        ...state,
        cart: cartItems
      };
    case ADD_CART_ITEM:
      return {
        ...state,
        cart: action.payload
      };
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cart: action.payload
      };
    default:
      return state;
  }
};

export default shopReducer;
