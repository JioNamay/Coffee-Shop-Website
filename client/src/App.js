import React, {Fragment} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Provider } from 'react-redux'
import './App.css';
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import Cart from "./pages/Cart";
import store from "./store/store";

const App = () => {

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navigation />
          <Route exact path="/" component={Home} />
          <Switch>
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/cart" component={Cart} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
};

export default App;
