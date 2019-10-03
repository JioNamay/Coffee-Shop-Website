import React, {Fragment} from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import Navigation from "./components/Navigation";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navigation />
        <Route exact path="/" component={Welcome} />
        <section className="test">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
