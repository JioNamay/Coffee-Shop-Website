import {LOGIN, LOGOUT, SIGNUP, TOKEN_LOGIN} from "../actions/userActions";
import {User} from "../../models/User";
import {
  ADMIN_LOGIN,
  ARCHIVE_ORDER,
  DELETE_ORDER,
  GET_ALL_USERS,
  GET_USER_ORDER_HISTORY,
  REMOVE_ORDER
} from "../actions/adminActions";
import {ADMIN_LOGOUT} from "../actions/adminActions";
import {Admin} from "../../models/Admin";
import {UserInfo} from "../../models/UserInfo";
import {OrderItemData} from "../../models/OrderItemData";

/**
 * Initial state for the user.
 */
const initialState = {
  admin: null,
  userInfo: [],
  orderHistory: {user: null, orderHistory: []},
};

/**
 * Reducer for the user.
 *
 * @param state   Current state
 * @param action  Given action
 */
const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN:
      let {
        adminId,
        username
      } = action.payload;

      const admin = new Admin(adminId, username);
      return {
        ...state,
        admin
      };


    case ADMIN_LOGOUT:
      return {
        ...state,
        admin: null
      };


    case GET_ALL_USERS:
      const userRes = action.payload.users;
      const userInfo = [];

      for (const user in userRes) {
        if (userRes.hasOwnProperty(user)) {
          const firstName = userRes[user].firstname;
          const lastName = userRes[user].lastname;
          const email = userRes[user].email;
          const id = userRes[user].userid;
          userInfo.push(new UserInfo(id, firstName, lastName, email));
        }
      }

      return {
        ...state,
        userInfo: userInfo
      };


    case GET_USER_ORDER_HISTORY:
      const userResult = action.payload.user;
      const orderHistoryResult = action.payload.orderHistory;
      const orderHistoryItems = [];

      // fill in the user
      const user = new UserInfo(
        userResult[0].id,
        userResult[0].firstname,
        userResult[0].lastname,
        userResult[0].email
      );

      // fill in the order history
      for (const historyItem in orderHistoryResult) {
        if (orderHistoryResult.hasOwnProperty(historyItem)) {
          const orderItemId = orderHistoryResult[historyItem].orderitemid;
          const itemId = orderHistoryResult[historyItem].itemid;
          const date = orderHistoryResult[historyItem].dateordered.split('T')[0];
          const name = orderHistoryResult[historyItem].name;
          const description = orderHistoryResult[historyItem].description;
          const price = orderHistoryResult[historyItem].price;
          const image = orderHistoryResult[historyItem].image;

          orderHistoryItems.push(new OrderItemData(orderItemId, itemId, date, name, description, price, image));
        }
      }

      return {
        ...state,
        orderHistory: {user: user, orderHistory: orderHistoryItems},
      };


    case REMOVE_ORDER:
      return {
        ...state,
        orderHistory: {user: action.payload.user, orderHistory: action.payload.orderHistory}
      };

    default:
      return state;
  }
};

export default adminReducer;
