import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";

import userReducer from "./reducers/userReducer";
import shopReducer from "./reducers/shopReducer";

const rootReducer = combineReducers({
  user: userReducer,
  shop: shopReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
