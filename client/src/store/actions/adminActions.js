import axios from 'axios'

export const ADMIN_LOGIN = 'ADMIN_LOGIN';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';

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
            console.log('HERE');
            console.log(username);
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
