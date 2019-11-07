import {LOGIN, LOGOUT, SIGNUP, TOKEN_LOGIN} from "../actions/userActions";
import { User } from "../../models/User";
import {ADMIN_LOGIN, GET_ALL_USERS} from "../actions/adminActions";
import {ADMIN_LOGOUT} from "../actions/adminActions";
import {Admin} from "../../models/Admin";
import {UserInfo} from "../../models/UserInfo";

/**
 * Initial state for the user.
 */
const initialState = {
    admin: null,
    userInfo: []
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
            // If you need to format anything here
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
            console.log('REDUCER');
            console.log(userInfo);
            return {
                ...state,
                userInfo: userInfo
            };
        default:
            return state;
    }
};

export default adminReducer;
