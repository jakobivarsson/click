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
        <svg id="circle-container">
          <circle id="circle" cx="10" cy="10" r="0"/>
        </svg>
        <Router history={browserHistory}>
          <Route path="/" component={Counters} onEnter={requireAuth} />
          <Route path="/buildings/:name" component={Counter} onEnter={requireAuth} />
          <Route path="/login" component={(() => <Login animate={animate} />)} />
          <Route path="/statistics" component={Statistics} onEnter={requireAuth} />
        </Router>
      </div>
    );
  }
}

function animate(x,y) {
  const circle = document.getElementById('circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);

  circle.setAttribute('class', 'expand');
}
export default App;
