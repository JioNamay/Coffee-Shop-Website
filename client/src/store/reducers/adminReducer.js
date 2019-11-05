import {LOGIN, LOGOUT, SIGNUP, TOKEN_LOGIN} from "../actions/userActions";
import { User } from "../../models/User";
import {ADMIN_LOGIN} from "../actions/adminActions";
import {ADMIN_LOGOUT} from "../actions/adminActions";
import {Admin} from "../../models/Admin";

/**
 * Initial state for the user.
 */
const initialState = {
    admin: null
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
        default:
            return state;
    }
};

export default adminReducer;
