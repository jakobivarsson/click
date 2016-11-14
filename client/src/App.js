import React, { Component } from 'react';
import './App.css';
import Counter from './components/counter/Counter';
import Counters from './components/buildings/buildings';
import Login from './components/login/Login';
import { Router, Route, browserHistory } from 'react-router';

class App extends Component {
  render() {
    return (
	<Router history={browserHistory}>
	  <Route path="/" component={Counters} />
	  <Route path="/counter" component={Counter} />
	  <Route path="/login" component={Login} />
	  <Route path="*" component={App} />
	</Router>
    );
  }
}

export default App;
