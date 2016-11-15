import React, { Component } from 'react';
import Counter from './components/counter/Counter';
import Counters from './components/buildings/buildings';
import Login from './components/login/Login';
import { requireAuth } from './auth';
import { Router, Route, browserHistory } from 'react-router';

class App extends Component {
  render() {
    return (
	  <Router history={browserHistory}>
		<Route path="/" component={Counters} onEnter={requireAuth} />
		<Route path="/buildings/:name" component={Counter} onEnter={requireAuth}/>
		<Route path="/login" component={Login} />
	  </Router>
    );
  }
}

export default App;
