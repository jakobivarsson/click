import React, { Component } from 'react';
import Counter from './components/counter/Counter';
import Counters from './components/buildings/buildings';
import Login from './components/login/Login';
import Statistics from './components/statistics/Statistics';
import { requireAuth } from './auth';
import { Router, Route, browserHistory } from 'react-router';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Router history={browserHistory}>
          <Route path="/" component={Counters} onEnter={requireAuth} />
          <Route path="/buildings/:name" component={Counter} onEnter={requireAuth} />
          <Route path="/login" component={Login} />
          <Route path="/statistics" component={Statistics} onEnter={requireAuth} />
        </Router>
      </div>
    );
  }
}

export default App;
