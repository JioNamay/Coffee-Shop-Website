import {LOGIN, LOGOUT, SIGNUP, TOKEN_LOGIN} from "../actions/userActions";
import { User } from "../../models/User";

/**
 * Initial state for the user.
 */
const initialState = {
  user: null
};

/**
 * Reducer for the user.
 *
 * @param state   Current state
 * @param action  Given action
 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      return state;
    case LOGIN:
      let {
        userId,
        firstName,
        lastName,
        email,
        token
      } = action.payload;

      const user = new User(userId, firstName, lastName, email, token);
      return {
        ...state,
        user
      };
    case TOKEN_LOGIN:
      const tokenUser = new User(action.payload.userId, action.payload.firstName,
        action.payload.lastName, action.payload.email, action.token);
      return {
        ...state,
        user: tokenUser
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default userReducer;
