import axios from 'axios'
import {GET_ORDER_HISTORY} from "./shopActions";

export const ADMIN_LOGIN = 'ADMIN_LOGIN';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';

export const GET_ALL_USERS = "GET_USERS";
export const GET_USER_ORDER_HISTORY = "GET_USER_ORDER_HISTORY";
export const DELETE_ORDER = "DELETE_ORDER";

const config = {
    headers: {
        'Content-Type': 'application/json',
    }
};

export const adminLoginAction = (username, password) => {
    return async dispatch => {
        try {
            // Create a login request
            const body = JSON.stringify({username, password});
            const loginRequest = await axios.post('/api/admin/login', body, config);

            dispatch({
                type: ADMIN_LOGIN,
                payload: loginRequest.data
            })
        } catch (error) {
            let errorInfo = '';
            switch (error.response.data.errors) {
                case 'INVALID_LOGIN':
                    errorInfo = 'Incorrect username or password';
                    break;
                default:
                    errorInfo = 'Error with logging in';
            }
            throw new Error(errorInfo);
        }
    };
};

/*
 gets all the users as json
 */
export const getAllUsersAction = () => {
    return async (dispatch, getState) => {
        // Get the Admin ID
        const admin = getState().admin.admin;
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
                auth: `${admin.adminId}`
            }
        };

        // send get request
        const getUsersRequest = await axios.get(
          "/api/admin/users",
          requestConfig
        );

        dispatch({
            type: GET_ALL_USERS,
            payload: getUsersRequest.data
        });
    };
};

/*
 Returns json containing the user data and all their orders
 */
export const getOrderHistoryAction = (userId) => {
    return async (dispatch, getState) => {
        // Get the admin ID
        const admin = getState().admin.admin;
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
                auth: `${admin.adminId}`
            }
        };

        // send get request
        const getUserOrdersRequest = await axios.get(
          "/api/admin/user/" + userId,
          requestConfig
        );

        dispatch({
            type: GET_USER_ORDER_HISTORY,
            payload: getUserOrdersRequest.data
        });
    };
};

/*
 Deletes the order corresponding to the provided ID
 */
export const deleteOrderAction = (orderId) => {
    return async (dispatch, getState) => {
        // Get the user token
        const admin = getState().admin.admin;
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
                auth: `${admin.adminId}`
            }
        };

        // send delete request
        const deleteOrderRequest = await axios.delete(
          "/api/admin/order/" + orderId,
          requestConfig
        );

        dispatch({
            type: DELETE_ORDER,
            payload: deleteOrderRequest.data
        });
    };
};
