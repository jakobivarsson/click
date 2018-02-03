import React, { Component } from 'react';
import Counter from './components/counter/Counter';
import Counters from './components/buildings/buildings';
import Login from './components/login/Login';
import Statistics from './components/statistics/Statistics';
import { requireAuth } from './auth';
import { Router, Route, browserHistory } from 'react-router';
import Firebase from 'firebase'
import './App.css';

const config = {
  apiKey: "AIzaSyDbPJRWd9BcNkirK4j7G3WU_KwX7wR9MCA",
  authDomain: "click-9971c.firebaseapp.com",
  databaseURL: "https://click-9971c.firebaseio.com",
  projectId: "click-9971c",
  storageBucket: "click-9971c.appspot.com",
  messagingSenderId: "283373064514",
}
Firebase.initializeApp(config)

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
