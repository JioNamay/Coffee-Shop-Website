import axios from 'axios'

export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const LOGOUT = 'LOGOUT';
export const TOKEN_LOGIN = 'TOKEN_LOGIN';
export const RESET_EMAIL = 'RESET_EMAIL';
export const DO_RESET_PASSWORD = 'DO_RESET_PASSWORD';

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const signupAction = (firstName, lastName, email, password) => {
  return async dispatch => {
    // Create a signup request
    try {
      const body = JSON.stringify({firstName, lastName, email, password});
      await axios.post('/api/user/signup', body, config);

      dispatch({
        type: SIGNUP
      });
    } catch (error) {
      let errorInfo = '';
      switch (error.response.data.errors) {
        case 'EMAIL_EXISTS':
          errorInfo = 'Email already exists';
          break;
        default:
          errorInfo = 'Error with signing up';
      }
      throw new Error(errorInfo);
    }
  }
};

export const loginAction = (email, password) => {
  return async dispatch => {
    try {
      // Create a login request
      const body = JSON.stringify({email, password});
      const loginRequest = await axios.post('/api/user/login', body, config);

      dispatch({
        type: LOGIN,
        payload: loginRequest.data
      })
    } catch (error) {
      let errorInfo = '';
      switch (error.response.data.errors) {
        case 'INVALID_LOGIN':
          errorInfo = 'Incorrect email or password';
          break;
        default:
          errorInfo = 'Error with logging in';
      }
      throw new Error(errorInfo);
    }
  };
};

export const tokenLoginAction = (token) => {
  return async dispatch => {
    try {
      const body = JSON.stringify({token});
      const tokenLoginRequest = await axios.post('/api/user/tokenlogin', body, config);
      dispatch({
        type: TOKEN_LOGIN,
        payload: tokenLoginRequest.data,
        token: token
      });
    } catch (error) {
      throw new Error();
    }
  }
};

export const resetPasswordAction = (email) => {
  return async dispatch => {
    try {
      const body = JSON.stringify({email});
      axios.post('/api/user/identify', body, config);
      dispatch({
        type: RESET_EMAIL
      });
    } catch (error) {

    }
  }
};

export const doResetAction = (token, password) => {
  return async dispatch => {
    try {
      const body = JSON.stringify({token, password});
      const passwordResetRequest = await axios.post('/api/user/passwordreset', body, config);

      dispatch({
        type: DO_RESET_PASSWORD
      });
    } catch (error) {
      throw new Error(error.response.data.errors);
    }
  }
};
