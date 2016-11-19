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
          <circle id="circle" cx="10" cy="10" r="1000vh"/>
        </svg>
        <Router history={browserHistory}>
          <Route path="/" component={Counters} onEnter={requireAuth} />
          <Route path="/buildings/:name" component={Counter} onEnter={requireAuth} />
          <Route path="/login" component={(() => <Login animate={animate} resetAnimation={resetRadialAnimation} />)} />
          <Route path="/statistics" component={Statistics} onEnter={requireAuth} />
        </Router>
      </div>
    );
  }
}

function resetRadialAnimation() {
  const circle = document.getElementById('circle');
  circle.setAttribute('r', 0);
  // Setting the radius to 0 will cause the animation to run in reverse, so hide the circle so this will not be visible
  circle.setAttribute('visibility', 'hidden');
}

function animate(x, y) {
  let circle = document.getElementById('circle');
  circle.setAttribute('visibility', 'visible');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);

  circle.setAttribute('class', 'expand');
}

export default App;
